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
        PageResult<CatalogItem> externalResult = externalCatalogRepository.fetch(filter, pagination);
        externalResult.items().forEach(item -> {
            if (!catalogRepository.alreadyExists(item)) {
                catalogRepository.save(item);
            }
        });

        CatalogSearchStatus status = CatalogSearchStatus.builder()
                .queryKey(QueryKeyUtil.buildKey(filter))
                .rawQuery(filter.getTitleContains())
                .type(filter.getType())
                .fetchedPages(pagination.getPage())
                .lastFetchedAt(LocalDateTime.now())
                .build();
        searchStatusRepository.save(status);

        return catalogRepository.search(filter, pagination);
    }
}
