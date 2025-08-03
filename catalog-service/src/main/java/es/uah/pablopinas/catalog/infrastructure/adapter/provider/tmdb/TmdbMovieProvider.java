package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.TmdbTrending;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.NamedIdElement;
import info.movito.themoviedbapi.model.movies.Credits;
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
        try {
            MovieResultsPage moviesPage = apiSearch
                    .searchMovie(filter.getTitleContains(),
                            pagination.getPage() + 1 // TMDB uses 1-based indexing
                    );
            if (moviesPage == null || moviesPage.getResults() == null) {
                log.warn("No movies found for filter: {}", filter);
                return PageResult.empty(pagination);
            }

            var items = translateResults(moviesPage);
            return PageResult.of(items, pagination);
        } catch (Exception e) {
            log.error("Error while fetching TMDB items: {}", e.getMessage());
            return PageResult.empty(pagination);
        }
    }

    /**
     * Fetches trending movies from TMDB (by week) with pagination.
     *
     * @param pagination pagination settings (page, size)
     * @return a page of trending catalog items
     */
    @Override
    public PageResult<CatalogItem> fetchTrending(Pagination pagination) {
        TmdbTrending tmdbTrending = tmdbApi.getTrending();
        try {
            MovieResultsPage resultsPage = tmdbTrending.getMovies(
                    TimeWindow.WEEK,
                    TmdbConfig.LANGUAGE,
                    pagination.getPage() + 1 // TMDB uses 1-based indexing
            );

            var items = translateResults(resultsPage);
            return PageResult.of(items, pagination);
        } catch (Exception e) {
            log.error("Error while fetching trending items from TMDB: {}", e.getMessage());
            return PageResult.empty(pagination);
        }
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
    private void asyncUpdateWithCreators(CatalogItem item, int tmdbId) {
        executor.submit(() -> {
            try {
                var creators = tmdbMovies.getCredits(tmdbId, TmdbConfig.LANGUAGE)
                        .getCrew()
                        .stream()
                        .filter(c -> "Director".equalsIgnoreCase(c.getJob()))
                        .map(NamedIdElement::getName)
                        .toList();

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

}