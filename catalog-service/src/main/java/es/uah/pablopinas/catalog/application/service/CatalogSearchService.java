package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.SearchCatalogItemsUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogFetchQueuePort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.domain.util.QueryKeyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Application service responsible for handling catalog item searches.
 * <p>
 * It coordinates between the local catalog repository and the fetcher service,
 * determining whether to return local results, perform a synchronous fetch,
 * or enqueue an asynchronous background fetch based on query freshness and coverage.
 */
@Service
@RequiredArgsConstructor
public class CatalogSearchService implements SearchCatalogItemsUseCase {

    private final CatalogItemRepositoryPort catalogRepository;
    private final CatalogSearchStatusRepositoryPort searchStatusRepository;
    private final ExternalCatalogFetchQueuePort fetcherService;

    /**
     * Searches catalog items using the provided filter and pagination.
     * <p>
     * If results are not found locally and the query was never fetched before,
     * it will trigger a synchronous fetch from the external provider.
     * <p>
     * If results are stale or pagination exceeds what's been previously fetched,
     * it will enqueue a background fetch to update the local catalog asynchronously.
     *
     * @param filter     the search filter (title, type, genre, year)
     * @param pagination pagination parameters (page number and size)
     * @return a page result containing catalog items from the local repository
     */
    @Override
    public PageResult<CatalogItem> search(CatalogSearchFilter filter, Pagination pagination) {
        String queryKey = QueryKeyUtil.buildKey(filter, pagination);

        Optional<CatalogSearchStatus> statusOpt = searchStatusRepository.findByQueryKey(queryKey);

        boolean isStale = statusOpt
                .map(s -> s.getLastFetchedAt().isBefore(LocalDateTime.now().minusDays(7)))
                .orElse(true);

        PageResult<CatalogItem> localResult = catalogRepository.search(filter, pagination);

        if (localResult.isEmpty()) {
            // Never fetched before or empty result
            return fetcherService.fetchAndCache(filter, pagination);
        }

        if (isStale) {
            // Results are stale, enqueue a background fetch
            fetcherService.enqueueFetch(filter, pagination);
        }

        return localResult;
    }

}
