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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
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
                    asyncUpdateWithCreators(item, tv.getId());
                    asyncUpdateWithDetails(item, tv.getId());
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

                return results.getResults().stream()
                        .map(tv -> {
                            var item = tvShowMapper.toDomain(tv);
                            asyncUpdateWithCreators(item, tv.getId());
                            asyncUpdateWithDetails(item, tv.getId());
                            return item;
                        }).toList();

            } catch (Exception e) {
                log.warn("Error fetching TMDB trending TV page {}: {}", tmdbPage, e.getMessage());
                return List.of();
            }
        });
    }

    private void asyncUpdateWithCreators(CatalogItem item, int tmdbId) {
        executor.submit(() -> {
            try {
                Credits credits = tmdbTvSeries.getCredits(tmdbId, TmdbConfig.LANGUAGE);

                var creators = credits.getCrew().stream()
                        .filter(c -> "Director".equalsIgnoreCase(c.getJob())
                                || "Executive Producer".equalsIgnoreCase(c.getJob())
                                || "Creator".equalsIgnoreCase(c.getJob()))
                        .map(NamedIdElement::getName)
                        .distinct()
                        .toList();

                if (!creators.isEmpty()) {
                    item.setCreators(creators);
                    catalogItemRepository.update(item.getId(), item);
                    log.info("Enriched TV show '{}' with creators: {}", item.getTitle(), creators);
                }
            } catch (Exception e) {
                log.warn("Failed to enrich series '{}' with creators: {}", item.getTitle(), e.getMessage());
            }
        });
    }

    private void asyncUpdateWithDetails(CatalogItem item, int tmdbId) {
        executor.submit(() -> {
            try {
                TvSeriesDb details = tmdbTvSeries.getDetails(tmdbId, TmdbConfig.LANGUAGE);

                Integer seasons = details.getNumberOfSeasons();
                Integer episodes = details.getNumberOfEpisodes();
                List<Integer> runtimes = details.getEpisodeRunTime();
                String originalLanguage = details.getOriginalLanguage();

                boolean hasDetails = (seasons != null || episodes != null || (runtimes != null && !runtimes.isEmpty()));

                if (hasDetails) {
                    int avgRuntime = runtimes != null && !runtimes.isEmpty()
                            ? (int) runtimes.stream().mapToInt(Integer::intValue).average().orElse(0)
                            : 0;

                    TvShowDetails tvShowDetails = TvShowDetails.builder()
                            .seasonCount(seasons)
                            .episodeCount(episodes)
                            .averageRuntime(avgRuntime)
                            .originalLanguage(originalLanguage)
                            .build();

                    item.setDetails(tvShowDetails);
                    catalogItemRepository.update(item.getId(), item);

                    log.info("Enriched TV show '{}' with details: {} seasons, {} episodes, {} min",
                            item.getTitle(), seasons, episodes, avgRuntime);
                }

            } catch (Exception e) {
                log.warn("Failed to enrich series '{}' with details: {}", item.getTitle(), e.getMessage());
            }
        });
    }
}
