package es.uah.pablopinas.catalog.infrastructure.adapter.provider.tmdb;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.model.Pagination;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class TmdbPaginationHelper {

    private static final int TMDB_PAGE_SIZE = 20;

    /**
     * Fetches a page of CatalogItems from TMDB with flexible pagination.
     * This method allows for pagination that may not align perfectly with TMDB's page size.
     *
     * @param pagination    The pagination parameters (page number and size).
     * @param fetchTmdbPage A function that fetches a list of CatalogItems for a given TMDB page number.
     * @return A PageResult containing the requested page of CatalogItems.
     */
    public static PageResult<CatalogItem> fetchWithFlexiblePagination(
            Pagination pagination,
            Function<Integer, List<CatalogItem>> fetchTmdbPage
    ) {
        int size = pagination.getSize();
        int offset = pagination.getPage() * size;

        int tmdbPageStart = (offset / TMDB_PAGE_SIZE) + 1;
        int tmdbPageEnd = ((offset + size - 1) / TMDB_PAGE_SIZE) + 1;

        List<CatalogItem> allItems = new ArrayList<>();

        for (int tmdbPage = tmdbPageStart; tmdbPage <= tmdbPageEnd; tmdbPage++) {
            List<CatalogItem> pageItems = fetchTmdbPage.apply(tmdbPage);
            if (pageItems == null || pageItems.isEmpty()) break;
            allItems.addAll(pageItems);
        }

        int startIndex = offset % TMDB_PAGE_SIZE;
        List<CatalogItem> pageSlice = allItems.stream()
                .skip(startIndex)
                .limit(size)
                .toList();

        return PageResult.of(pageSlice, pagination);
    }
}
