package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogFetchQueuePort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.domain.util.QueryKeyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CatalogFetcherService implements ExternalCatalogFetchQueuePort {

    private final CatalogItemRepositoryPort catalogRepository;
    private final ExternalCatalogRepositoryPort externalCatalogRepository;
    private final CatalogSearchStatusRepositoryPort searchStatusRepository;

    @Override
    public void enqueueFetch(CatalogSearchFilter filter, Pagination pagination) {
        fetchInBackground(filter, pagination);
    }

    @Async
    public void fetchInBackground(CatalogSearchFilter filter, Pagination pagination) {
        fetchAndCache(filter, pagination);
    }

    public PageResult<CatalogItem> fetchAndCache(CatalogSearchFilter filter, Pagination pagination) {
        // Verifica y recupera páginas anteriores si es necesario
        fetchMissingPreviousPages(filter, pagination);

        // Fetchea la página solicitada desde el proveedor externo
        fetchFromExternalProviderAndCache(filter, pagination);

        // Devuelve los resultados desde el almacenamiento local
        return catalogRepository.search(filter, pagination);
    }


    private void updateSearchStatus(CatalogSearchFilter filter, Pagination pagination, PageResult<CatalogItem> result) {
        CatalogSearchStatus status = CatalogSearchStatus.builder()
                .queryKey(QueryKeyUtil.buildKey(filter, pagination))
                .rawQuery(QueryKeyUtil.buildRawKey(filter, pagination))
                .type(filter.getType())
                .fetchedPages(pagination.getPage())
                .lastFetchedAt(LocalDateTime.now())
                .build();

        searchStatusRepository.save(status);
    }

    private void fetchMissingPreviousPages(CatalogSearchFilter filter, Pagination pagination) {
        int currentPage = pagination.getPage();

        // No hay páginas anteriores a la 1
        if (currentPage <= 1) return;

        // Desde la 1 hasta la anterior a la actual
        for (int i = 1; i < currentPage; i++) {
            Pagination previous = new Pagination(i, pagination.getSize());
            String queryKey = QueryKeyUtil.buildKey(filter, previous);

            boolean alreadyFetched = searchStatusRepository.findByQueryKey(queryKey).isPresent();

            if (!alreadyFetched) {
                // Fetch sincrónico de la página anterior
                fetchFromExternalProviderAndCache(filter, previous);
            }
        }
    }

    private void fetchFromExternalProviderAndCache(CatalogSearchFilter filter, Pagination pagination) {
        PageResult<CatalogItem> previousResult = externalCatalogRepository.fetch(filter, pagination);

        previousResult.items().forEach(item -> {
            catalogRepository.save(item);
        });

        updateSearchStatus(filter, pagination, previousResult);
    }


}
