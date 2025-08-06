package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component("googleBooksBookProvider")
@RequiredArgsConstructor
public class GoogleBooksBookProvider implements ExternalProviderStrategy {

    private final GoogleBooksSearchClient client;
    private final GoogleBooksBookMapper mapper;
    private final CatalogItemRepositoryPort repository;

    private final ExecutorService executor = Executors.newFixedThreadPool(5);

    private static final List<String> BASE_TRENDING_QUERIES = List.of(
            "bestseller books", "fantasy novels", "romance books",
            "science fiction", "young adult", "historical fiction"
    );

    private volatile List<String> trendingQueries = new ArrayList<>(BASE_TRENDING_QUERIES);

    @Scheduled(cron = "0 0 0 * * *") // cada día a medianoche
    public void refreshTrendingQueries() {
        trendingQueries = new ArrayList<>(BASE_TRENDING_QUERIES); // puedes hacer que cambien aleatoriamente si quieres
        Collections.shuffle(trendingQueries);
        log.info("Trending queries actualizadas: {}", trendingQueries);
    }

    @Override
    public boolean supports(CatalogType type) {
        return type == CatalogType.BOOK;
    }

    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        try {
            var result = client.searchVolumes(filter.getTitleContains(), pagination.getPage() * pagination.getSize(), pagination.getSize());

            if (result == null || result.items() == null) {
                return PageResult.empty(pagination);
            }

            var items = result.items().stream()
                    .map(mapper::toCatalogItemBasic)
                    .peek(this::enrichAsync)
                    .toList();

            return PageResult.of(items, pagination);

        } catch (Exception e) {
            log.error("Error fetching from Google Books: {}", e.getMessage(), e);
            return PageResult.empty(pagination);
        }
    }

    @Override
    public PageResult<CatalogItem> fetchTrending(Pagination pagination) {
        try {
            int queriesCount = trendingQueries.size();
            int offset = pagination.getPage() * pagination.getSize();
            int maxNeeded = offset + pagination.getSize();
            int itemsPerQuery = (int) Math.ceil((double) maxNeeded / queriesCount);

            List<List<CatalogItem>> perQueryResults = trendingQueries.stream()
                    .map(q -> {
                        try {
                            var result = client.searchVolumes(q, 0, itemsPerQuery);
                            if (result != null && result.items() != null) {
                                return result.items().stream()
                                        .map(mapper::toCatalogItemBasic)
                                        .toList();
                            }
                        } catch (Exception e) {
                            log.warn("Fallo al obtener trending con query '{}': {}", q, e.getMessage());
                        }
                        return List.<CatalogItem>of();
                    })
                    .toList();

            List<CatalogItem> interleaved = interleave(perQueryResults);

            int fromIndex = Math.min(offset, interleaved.size());
            int toIndex = Math.min(fromIndex + pagination.getSize(), interleaved.size());

            return PageResult.of(interleaved.subList(fromIndex, toIndex), pagination);

        } catch (Exception e) {
            log.error("Error fetching trending from Google Books", e);
            return PageResult.empty(pagination);
        }
    }

    private List<CatalogItem> interleave(List<List<CatalogItem>> lists) {
        List<CatalogItem> result = new ArrayList<>();
        int maxSize = lists.stream().mapToInt(List::size).max().orElse(0);

        for (int i = 0; i < maxSize; i++) {
            for (List<CatalogItem> list : lists) {
                if (i < list.size()) {
                    result.add(list.get(i));
                }
            }
        }

        return result;
    }

    private void enrichAsync(CatalogItem item) {
        executor.submit(() -> {
            try {
                var full = client.getVolumeById(item.getExternalSource().getExternalId());
                if (full != null) {
                    repository.save(mapper.enrich(item, full));
                    log.debug("Enriched item: {}", item.getTitle());
                }
            } catch (Exception e) {
                log.warn("Error enriching item '{}': {}", item.getTitle(), e.getMessage());
            }
        });
    }
}

