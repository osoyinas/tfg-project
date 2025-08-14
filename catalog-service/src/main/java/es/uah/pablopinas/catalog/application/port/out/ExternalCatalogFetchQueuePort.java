package es.uah.pablopinas.catalog.application.port.out;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.model.Pagination;

/**
 * Outbound port for fetching catalog items from external providers.
 * <p>
 * This interface abstracts both synchronous and asynchronous fetching logic.
 * Implementations may use direct API calls, background jobs, message queues, or other mechanisms.
 * <p>
 * It is used by application services (e.g., CatalogSearchService) to trigger external lookups
 * and cache the results locally without depending on infrastructure details.
 */
public interface ExternalCatalogFetchQueuePort {

    /**
     * Enqueues a request to fetch catalog items from an external provider in the background.
     * <p>
     * This method is non-blocking and should trigger an asynchronous process
     * (e.g., using @Async, message queues, or scheduled workers).
     *
     * @param filter     the search filter to be applied to the external lookup
     * @param pagination the page to fetch
     */
    void enqueueFetch(CatalogSearchFilter filter, Pagination pagination);

    /**
     * Performs a blocking fetch of catalog items from an external provider,
     * caches new results into the local repository, and updates the search status.
     * <p>
     * This method is intended for first-time queries or when no local data exists.
     *
     * @param filter     the search filter to be applied to the external lookup
     * @param pagination the page to fetch
     * @return a page result containing catalog items, typically freshly fetched and cached
     */
    PageResult<CatalogItem> fetchAndCache(CatalogSearchFilter filter, Pagination pagination);
}
