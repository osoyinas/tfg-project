package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.GetRelevantCatalogItemsUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Application service responsible for retrieving relevant or trending catalog items
 * such as movies, books, or series, based on external provider data.
 * <p>
 * This service caches trending results for each content type (e.g., BOOK, MOVIE)
 * and refreshes them only if the data is stale, based on a defined TTL (6 hours).
 */
@Service
@RequiredArgsConstructor
public class TrendingCatalogService implements GetRelevantCatalogItemsUseCase {

    /**
     * Time-to-live (TTL) for trending data before it is considered stale.
     * In this case, data older than 1 week will be refreshed.
     */
    private static final long TRENDING_CACHE_TTL_DAYS = 7;
    private final CatalogItemRepositoryPort catalogRepository;
    private final ExternalCatalogRepositoryPort externalCatalogRepository;
    private final CatalogSearchStatusRepositoryPort searchStatusRepository;

    /**
     * Retrieves a page of relevant (trending) catalog items of a specific type.
     * <p>
     * If the data is older than 6 hours, it performs a new fetch from the external provider,
     * updates the local cache, marks items as relevant, and stores the new search status.
     *
     * @param type       the catalog type to fetch (MOVIE, BOOK, TV_SERIE)
     * @param pagination the pagination parameters
     * @return a page result containing relevant catalog items
     */
    @Override
    public PageResult<CatalogItem> getRelevantCatalogItems(CatalogType type, Pagination pagination) {
        int requestedPage = pagination.getPage();
        int pageSize = pagination.getSize();

        boolean needsFetch = false;
        for (int i = 0; i <= requestedPage; i++) {
            String queryKey = "TRENDING_" + type.name() + "_" + i + "_" + pageSize;
            Optional<CatalogSearchStatus> statusOpt = searchStatusRepository.findByQueryKey(queryKey);

            boolean isStale = statusOpt
                    .map(s -> s.getLastFetchedAt().isBefore(LocalDateTime.now().minusDays(TRENDING_CACHE_TTL_DAYS)))
                    .orElse(true);

            if (isStale) {
                needsFetch = true;
                break;
            }
        }

        if (needsFetch) {
            for (int i = 0; i <= requestedPage; i++) {
                String queryKey = "TRENDING_" + type.name() + "_" + i + "_" + pageSize;

                // Solo si está desactualizado o no existe
                Optional<CatalogSearchStatus> statusOpt = searchStatusRepository.findByQueryKey(queryKey);
                boolean isStale = statusOpt
                        .map(s -> s.getLastFetchedAt().isBefore(LocalDateTime.now().minusDays(TRENDING_CACHE_TTL_DAYS)))
                        .orElse(true);

                if (isStale) {
                    Pagination currentPage = new Pagination(i, pageSize);
                    PageResult<CatalogItem> externalResult = externalCatalogRepository.fetchTrending(type, currentPage);
                    externalResult.items().forEach(item -> {
                        item.setRelevant(true);
                        item.setRelevantUntil(LocalDateTime.now().plusWeeks(1));
                        if (!catalogRepository.alreadyExists(item)) {
                            catalogRepository.save(item);
                        }
                    });

                    CatalogSearchStatus status = CatalogSearchStatus.builder()
                            .queryKey(queryKey)
                            .rawQuery("TRENDING")
                            .type(type)
                            .fetchedPages(i)
                            .lastFetchedAt(LocalDateTime.now())
                            .build();
                    searchStatusRepository.save(status);
                }
            }
        }

        return catalogRepository.findRelevantItems(type, pagination);
    }

}
