package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.movie;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.domain.model.details.MovieDetails;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbBasicSearch;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbConfig;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbPaginationHelper;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.TmdbTrending;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.NamedIdElement;
import info.movito.themoviedbapi.model.movies.Credits;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.model.time.TimeWindow;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * External provider strategy implementation for fetching movies from TMDB (The Movie Database).
 * This component handles searching and retrieving trending movies, mapping them to domain models,
 * and asynchronously enriching them with additional metadata such as directors.
 */
@Slf4j
@Component("tmdbMovieProvider")
@RequiredArgsConstructor
public class TmdbMovieProvider implements ExternalProviderStrategy {

    private final TmdbBasicSearch apiSearch;
    private final TmdbMovieMapper movieMapper;
    private final TmdbApi tmdbApi;
    private final TmdbMovies tmdbMovies;
    private final CatalogItemRepositoryPort catalogItemRepository;

    /**
     * Thread pool used to asynchronously update catalog items with creators (e.g., directors).
     */
    private final ExecutorService executor = Executors.newFixedThreadPool(5);

    /**
     * Determines whether this provider supports a given catalog type.
     *
     * @param type the catalog type to check
     * @return true if the type is MOVIE, false otherwise
     */
    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.MOVIE;
    }

    /**
     * Fetches movies from TMDB based on a filter and pagination.
     *
     * @param filter     search filter including title and other parameters
     * @param pagination pagination settings (page, size)
     * @return a page of catalog items matching the search criteria
     */
    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        return TmdbPaginationHelper.fetchWithFlexiblePagination(pagination, tmdbPage -> {
            try {
                var results = apiSearch.searchMovie(filter.getTitleContains(), tmdbPage);
                if (results == null || results.getResults() == null) return List.of();

                return translateResults(results);

            } catch (Exception e) {
                log.warn("Error fetching TMDB movie page {}: {}", tmdbPage, e.getMessage());
                return List.of();
            }
        });
    }

    @Override
    public PageResult<CatalogItem> fetchTrending(Pagination pagination) {
        TmdbTrending trending = tmdbApi.getTrending();

        return TmdbPaginationHelper.fetchWithFlexiblePagination(pagination, tmdbPage -> {
            try {
                MovieResultsPage results = trending.getMovies(TimeWindow.WEEK, TmdbConfig.LANGUAGE, tmdbPage);
                if (results == null || results.getResults() == null) return List.of();

                return translateResults(results);

            } catch (Exception e) {
                log.warn("Error fetching TMDB trending movie page {}: {}", tmdbPage, e.getMessage());
                return List.of();
            }
        });
    }

    /**
     * Converts a TMDB results page to a list of catalog items, triggering asynchronous enrichment with directors.
     *
     * @param moviesPage TMDB page result
     * @return list of mapped and enriched catalog items
     */
    private List<CatalogItem> translateResults(MovieResultsPage moviesPage) {
        return moviesPage.getResults()
                .stream()
                .map(movie -> {
                    var item = movieMapper.toDomain(movie); // initial mapping without directors
                    asyncUpdateWithCreators(item, movie.getId()); // enrich in background
                    asyncUpdateWithDetails(item, movie.getId()); // enrich with details in background
                    return item;
                })
                .toList();
    }

    /**
     * Asynchronously enriches a catalog item with its directors by calling TMDB credits API.
     * Once directors are retrieved, updates the catalog item in the database.
     *
     * @param item   the catalog item to enrich
     * @param tmdbId the TMDB movie ID
     */
    protected void asyncUpdateWithCreators(CatalogItem item, int tmdbId) {
        executor.submit(() -> {
            try {
                var creators = extractCreatorsFromCredits(tmdbMovies.getCredits(tmdbId, TmdbConfig.LANGUAGE));

                if (!creators.isEmpty()) {
                    item.setCreators(creators);
                    catalogItemRepository.update(item.getId(), item);
                    log.info("Enriched '{}' with directors: {}", item.getTitle(), creators);
                }
            } catch (Exception e) {
                log.warn("Failed to enrich '{}' with creators: {}", item.getTitle(), e.getMessage());
            }
        });
    }

    private List<String> extractCreatorsFromCredits(Credits credits) {
        // Define the order of relevance
        List<String> relevanceOrder = List.of(
                "Director",
                "Screenplay", // sometimes listed instead of "Writer"
                "Writer",
                "Executive Producer",
                "Producer",
                "Original Music Composer"
        );

        // Use LinkedHashSet to preserve order and avoid duplicates
        Set<String> creators = new LinkedHashSet<>();

        for (String role : relevanceOrder) {
            credits.getCrew().stream()
                    .filter(c -> role.equalsIgnoreCase(c.getJob()))
                    .map(NamedIdElement::getName)
                    .forEach(creators::add);
        }

        return new ArrayList<>(creators);
    }

    private void asyncUpdateWithDetails(CatalogItem item, int tmdbId) {
        executor.submit(() -> {
            try {
                MovieDb details = tmdbMovies.getDetails(tmdbId, TmdbConfig.LANGUAGE);

                Integer runtime = details.getRuntime();
                if (runtime != null && runtime > 0) {
                    MovieDetails movieDetails = MovieDetails.builder()
                            .durationMinutes(runtime)
                            .originalLanguage(details.getOriginalLanguage())
                            .build();
                    item.setDetails(movieDetails);
                    catalogItemRepository.update(item.getId(), item);
                    log.info("Enriched '{}' with runtime: {} min", item.getTitle(), runtime);
                }
            } catch (Exception e) {
                log.warn("Failed to enrich '{}' with runtime: {}", item.getTitle(), e.getMessage());
            }
        });
    }

}