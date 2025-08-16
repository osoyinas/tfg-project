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
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component("tmdbMovieProvider")
@RequiredArgsConstructor
public class TmdbMovieProvider implements ExternalProviderStrategy {

    private final TmdbBasicSearch apiSearch;
    private final TmdbMovieMapper movieMapper;
    private final TmdbApi tmdbApi;
    private final TmdbMovies tmdbMovies;
    private final CatalogItemRepositoryPort catalogItemRepository;

    private final ExecutorService executor = Executors.newFixedThreadPool(5);

    @PreDestroy
    public void shutdown() {
        executor.shutdown();
    }

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.MOVIE;
    }

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

    private List<CatalogItem> translateResults(MovieResultsPage moviesPage) {
        return moviesPage.getResults()
                .stream()
                .map(movie -> {
                    var item = movieMapper.toDomain(movie); // mapeo inicial (sin enriquecimiento)
                    asyncEnrichAndUpsert(item, movie.getId()); // enriquecimiento paralelo + único upsert
                    return item;
                })
                .toList();
    }

    /**
     * Enriquecimiento asíncrono: obtiene en paralelo "creators" y "details" y realiza un único update (upsert).
     */
    private void asyncEnrichAndUpsert(CatalogItem item, int tmdbId) {
        // 1) Créditos (creators)
        CompletableFuture<List<String>> creatorsFuture = CompletableFuture.supplyAsync(() -> {
            try {
                Credits credits = tmdbMovies.getCredits(tmdbId, TmdbConfig.LANGUAGE);
                return extractCreatorsFromCredits(credits);
            } catch (Exception e) {
                log.warn("Failed to fetch credits for '{}' (tmdbId={}): {}", item.getTitle(), tmdbId, e.getMessage());
                return List.of();
            }
        }, executor);

        // 2) Detalles (runtime, originalLanguage)
        CompletableFuture<MovieDetails> detailsFuture = CompletableFuture.supplyAsync(() -> {
            try {
                MovieDb details = tmdbMovies.getDetails(tmdbId, TmdbConfig.LANGUAGE);
                Integer runtime = details != null ? details.getRuntime() : null;
                if (runtime != null && runtime > 0) {
                    return MovieDetails.builder()
                            .durationMinutes(runtime)
                            .originalLanguage(details.getOriginalLanguage())
                            .build();
                }
                return null;
            } catch (Exception e) {
                log.warn("Failed to fetch details for '{}' (tmdbId={}): {}", item.getTitle(), tmdbId, e.getMessage());
                return null;
            }
        }, executor);

        // 3) Combinar y hacer un único update (UPsert en tu repo)
        creatorsFuture.thenCombine(detailsFuture, (creators, details) -> {
            boolean changed = false;

            if (creators != null && !creators.isEmpty()) {
                item.setCreators(creators);
                changed = true;
            }
            if (details != null) {
                item.setDetails(details);
                changed = true;
            }
            return changed ? item : null;
        }).thenAccept(updated -> {
            if (updated != null) {
                try {
                    // IMPORTANTE: tu implementación de update() debe ser upsert.
                    catalogItemRepository.save(updated);
                    log.debug("Upserted enrichment for '{}': creators={}, details={}",
                            updated.getTitle(),
                            Optional.ofNullable(updated.getCreators()).orElse(List.of()),
                            Optional.ofNullable(updated.getDetails()).map(Object::toString).orElse("null"));
                } catch (Exception e) {
                    log.warn("Failed to upsert enrichment for '{}': {}", item.getTitle(), e.getMessage());
                }
            } else {
                log.debug("No enrichment changes for '{}', skipping update.", item.getTitle());
            }
        }).exceptionally(ex -> {
            log.warn("Unexpected error enriching '{}': {}", item.getTitle(), ex.getMessage(), ex);
            return null;
        });
    }

    private List<String> extractCreatorsFromCredits(Credits credits) {
        if (credits == null || credits.getCrew() == null) return List.of();

        List<String> relevanceOrder = List.of(
                "Director",
                "Screenplay",
                "Writer",
                "Executive Producer",
                "Producer",
                "Original Music Composer"
        );

        Set<String> creators = new LinkedHashSet<>();
        for (String role : relevanceOrder) {
            credits.getCrew().stream()
                    .filter(Objects::nonNull)
                    .filter(c -> c.getJob() != null && role.equalsIgnoreCase(c.getJob()))
                    .map(NamedIdElement::getName)
                    .filter(Objects::nonNull)
                    .forEach(creators::add);
        }
        return new ArrayList<>(creators);
    }
}
