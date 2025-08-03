package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.GetRelevantCatalogItemsUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.domain.util.QueryKeyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service responsible for retrieving and caching trending (relevant) catalog items
 * such as books, movies, or TV series. It ensures consistency by checking whether
 * the requested page and all previous ones are fresh or need to be fetched.
 */
@Service
@RequiredArgsConstructor
public class TrendingCatalogService implements GetRelevantCatalogItemsUseCase {

    /**
     * Time-to-live (TTL) for a trending page before it is considered stale.
     * After 7 days, trending pages will be refreshed.
     */
    private static final long TRENDING_CACHE_TTL_DAYS = 7;

    private final CatalogItemRepositoryPort catalogRepository;
    private final ExternalCatalogRepositoryPort externalCatalogRepository;
    private final CatalogSearchStatusRepositoryPort searchStatusRepository;

    /**
     * Returns a page of relevant (trending) catalog items for a specific type (e.g. MOVIE, BOOK).
     * If the requested page or any previous page is stale or missing, it will be fetched and cached.
     *
     * @param type       the catalog type to search
     * @param pagination pagination parameters
     * @return a locally cached page result of relevant catalog items
     */
    @Override
    public PageResult<CatalogItem> getRelevantCatalogItems(CatalogType type, Pagination pagination) {
        refreshMissingOrStalePages(type, pagination);
        return catalogRepository.findRelevantItems(type, pagination);
    }

    /**
     * Iterates from page 1 up to the requested page and refreshes any page
     * that is either missing or stale (based on TTL).
     *
     * @param type       the catalog type to fetch
     * @param pagination the requested page (and page size)
     */
    private void refreshMissingOrStalePages(CatalogType type, Pagination pagination) {
        int requestedPage = pagination.getPage();

        for (int i = 0; i <= requestedPage; i++) {
            Pagination page = new Pagination(i, pagination.getSize());
            String queryKey = QueryKeyUtil.buildTrendingKey(type, i, pagination.getSize());

            if (isPageMissingOrStale(queryKey)) {
                PageResult<CatalogItem> result = externalCatalogRepository.fetchTrending(type, page);
                saveItemsWithConsistency(result);
                saveSearchStatus(queryKey, type, i);
            }
        }
    }

    /**
     * Checks whether a page needs to be fetched because it is missing or outdated.
     *
     * @param queryKey unique query key for the trending page
     * @return true if the page needs to be fetched, false if it is fresh and cached
     */
    private boolean isPageMissingOrStale(String queryKey) {
        return searchStatusRepository.findByQueryKey(queryKey)
                .map(status -> status.getLastFetchedAt().isBefore(LocalDateTime.now().minusDays(TRENDING_CACHE_TTL_DAYS)))
                .orElse(true);
    }

    /**
     * Ensures that each fetched item has a unique ID and is stored only if it doesn't exist yet.
     * Also marks items as trending with an expiration timestamp.
     *
     * @param result the page result containing catalog items fetched from the provider
     */
    private void saveItemsWithConsistency(PageResult<CatalogItem> result) {
        result.items().forEach(item -> {
            item.setRelevant(true);
            item.setRelevantUntil(LocalDateTime.now().plusDays(TRENDING_CACHE_TTL_DAYS));
            catalogRepository.save(item);
        });
    }

    /**
     * Saves metadata about the trending search status so the system knows it has already been fetched.
     *
     * @param queryKey the unique key representing the trending page
     * @param type     the type of content (e.g. BOOK, MOVIE)
     * @param page     the page number that was fetched
     */
    private void saveSearchStatus(String queryKey, CatalogType type, int page) {
        CatalogSearchStatus status = CatalogSearchStatus.builder()
                .queryKey(queryKey)
                .rawQuery("TRENDING_" + type + "_" + page)
                .fetchedPages(page)
                .lastFetchedAt(LocalDateTime.now())
                .build();
        searchStatusRepository.save(status);
    }

}
