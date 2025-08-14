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

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
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
                var creators = extractCreatorsFromCredits(tmdbTvSeries.getCredits(tmdbId, TmdbConfig.LANGUAGE));

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
