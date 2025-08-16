package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.tv;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.domain.model.details.TvShowDetails;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbBasicSearch;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbConfig;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb.TmdbPaginationHelper;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbTrending;
import info.movito.themoviedbapi.TmdbTvSeries;
import info.movito.themoviedbapi.model.core.NamedIdElement;
import info.movito.themoviedbapi.model.core.TvSeriesResultsPage;
import info.movito.themoviedbapi.model.tv.core.credits.Credits;
import info.movito.themoviedbapi.model.tv.series.TvSeriesDb;
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
@Component("tmdbTvShowProvider")
@RequiredArgsConstructor
public class TmdbTvShowProvider implements ExternalProviderStrategy {

    private final TmdbBasicSearch tmdbSearch;
    private final TmdbTvShowMapper tvShowMapper;
    private final TmdbApi tmdbApi;
    private final TmdbTvSeries tmdbTvSeries;
    private final CatalogItemRepositoryPort catalogItemRepository;

    private final ExecutorService executor = Executors.newFixedThreadPool(5);

    @PreDestroy
    public void shutdown() {
        executor.shutdown();
    }

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.TV_SERIE;
    }

    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        return TmdbPaginationHelper.fetchWithFlexiblePagination(pagination, tmdbPage -> {
            try {
                var results = tmdbSearch.searchTv(filter.getTitleContains(), tmdbPage);
                if (results == null || results.getResults() == null) return List.of();

                return results.getResults().stream().map(tv -> {
                    var item = tvShowMapper.toDomain(tv);
                    asyncEnrichAndUpsert(item, tv.getId()); // único save (upsert)
                    return item;
                }).toList();

            } catch (Exception e) {
                log.warn("Error fetching TMDB TV page {}: {}", tmdbPage, e.getMessage());
                return List.of();
            }
        });
    }

    @Override
    public PageResult<CatalogItem> fetchTrending(Pagination pagination) {
        TmdbTrending trending = tmdbApi.getTrending();

        return TmdbPaginationHelper.fetchWithFlexiblePagination(pagination, tmdbPage -> {
            try {
                TvSeriesResultsPage results = trending.getTv(TimeWindow.WEEK, TmdbConfig.LANGUAGE, tmdbPage);
                if (results == null || results.getResults() == null) return List.of();

                return results.getResults().stream().map(tv -> {
                    var item = tvShowMapper.toDomain(tv);
                    asyncEnrichAndUpsert(item, tv.getId()); // único save (upsert)
                    return item;
                }).toList();

            } catch (Exception e) {
                log.warn("Error fetching TMDB trending TV page {}: {}", tmdbPage, e.getMessage());
                return List.of();
            }
        });
    }

    /**
     * Enriquecimiento asíncrono: obtiene en paralelo "creators" y "details" y realiza un único save (upsert).
     */
    private void asyncEnrichAndUpsert(CatalogItem item, int tmdbId) {
        // 1) Créditos (creators)
        CompletableFuture<List<String>> creatorsFuture = CompletableFuture.supplyAsync(() -> {
            try {
                Credits credits = tmdbTvSeries.getCredits(tmdbId, TmdbConfig.LANGUAGE);
                return extractCreatorsFromCredits(credits);
            } catch (Exception e) {
                log.warn("Failed to fetch TV credits for '{}' (tmdbId={}): {}", item.getTitle(), tmdbId, e.getMessage());
                return List.of();
            }
        }, executor);

        // 2) Detalles (seasons/episodes/avgRuntime/originalLanguage)
        CompletableFuture<TvShowDetails> detailsFuture = CompletableFuture.supplyAsync(() -> {
            try {
                TvSeriesDb details = tmdbTvSeries.getDetails(tmdbId, TmdbConfig.LANGUAGE);
                if (details == null) return null;

                Integer seasons = details.getNumberOfSeasons();
                Integer episodes = details.getNumberOfEpisodes();
                List<Integer> runtimes = details.getEpisodeRunTime();
                String originalLanguage = details.getOriginalLanguage();

                boolean hasAny = (seasons != null) || (episodes != null) || (runtimes != null && !runtimes.isEmpty());
                if (!hasAny) return null;

                int avgRuntime = (runtimes != null && !runtimes.isEmpty())
                        ? (int) runtimes.stream().mapToInt(Integer::intValue).average().orElse(0)
                        : 0;

                return TvShowDetails.builder()
                        .seasonCount(seasons)
                        .episodeCount(episodes)
                        .averageRuntime(avgRuntime)
                        .originalLanguage(originalLanguage)
                        .build();

            } catch (Exception e) {
                log.warn("Failed to fetch TV details for '{}' (tmdbId={}): {}", item.getTitle(), tmdbId, e.getMessage());
                return null;
            }
        }, executor);

        // 3) Combinar y hacer un único save (UPsert en tu repo)
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
                    catalogItemRepository.save(updated); // tu save implementa upsert
                    log.debug("Upserted TV enrichment for '{}': creators={}, details={}",
                            updated.getTitle(),
                            Optional.ofNullable(updated.getCreators()).orElse(List.of()),
                            Optional.ofNullable(updated.getDetails()).map(Object::toString).orElse("null"));
                } catch (Exception e) {
                    log.warn("Failed to upsert TV enrichment for '{}': {}", item.getTitle(), e.getMessage());
                }
            } else {
                log.debug("No TV enrichment changes for '{}', skipping save.", item.getTitle());
            }
        }).exceptionally(ex -> {
            log.warn("Unexpected error enriching TV show '{}': {}", item.getTitle(), ex.getMessage(), ex);
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
