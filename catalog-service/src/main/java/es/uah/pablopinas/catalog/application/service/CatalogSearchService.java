package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.GetRelevantCatalogItemsUseCase;
import es.uah.pablopinas.catalog.application.port.in.SearchCatalogItemsUseCase;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchCatalogItemsService implements SearchCatalogItemsUseCase, ExternalCatalogFetchQueuePort, GetRelevantCatalogItemsUseCase {

    private final CatalogItemRepositoryPort catalogRepository;
    private final ExternalCatalogRepositoryPort externalCatalogRepository;
    private final CatalogSearchStatusRepositoryPort searchStatusRepository;
    private final ExternalCatalogFetchQueuePort fetchQueue;

    @Override
    public PageResult<CatalogItem> search(CatalogSearchFilter filter, Pagination pagination) {
        PageResult<CatalogItem> localResults = catalogRepository.search(filter, pagination);
        boolean hasLocalResults = !localResults.items().isEmpty();

        Optional<CatalogSearchStatus> statusOpt = searchStatusRepository.findByFilter(filter);

        boolean neverFetched = statusOpt.isEmpty();
        boolean notEnoughPages = statusOpt.map(s -> pagination.getPage() > s.getFetchedPages()).orElse(true);
        boolean isStale = statusOpt.map(s -> s.getLastFetchedAt().isBefore(LocalDateTime.now().minusDays(7))).orElse(true);

        if (!hasLocalResults && neverFetched) {
            return fetchAndCache(filter, pagination);
        }

        if (notEnoughPages || isStale) {
            fetchQueue.enqueueFetch(filter, pagination);
        }

        return localResults;
    }

    @Override
    public void enqueueFetch(CatalogSearchFilter filter, Pagination pagination) {
        fetchInBackground(filter, pagination);
    }

    @Async
    public void fetchInBackground(CatalogSearchFilter filter, Pagination pagination) {
        fetchAndCache(filter, pagination);
    }

    private PageResult<CatalogItem> fetchAndCache(CatalogSearchFilter filter, Pagination pagination) {
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

    @Override
    public PageResult<CatalogItem> getRelevantCatalogItems(CatalogType type, Pagination pagination) {
        String queryKey = "TRENDING_" + type.name(); // Clave clara, sin engaños

        Optional<CatalogSearchStatus> statusOpt = searchStatusRepository.findByQueryKey(queryKey);
        boolean isStale = statusOpt.map(s -> s.getLastFetchedAt().isBefore(LocalDateTime.now().minusHours(6))).orElse(true);

        if (isStale) {
            PageResult<CatalogItem> externalResult = externalCatalogRepository.fetchTrending(type, pagination);
            externalResult.items().forEach(item -> {
                item.setRelevant(true);
                item.setRelevantUntil(LocalDateTime.now().plusWeeks(1));
                if (catalogRepository.alreadyExists(item)) {
                    catalogRepository.update(item.getId(), item);
                } else {
                    catalogRepository.save(item);
                }
            });

            CatalogSearchStatus status = CatalogSearchStatus.builder()
                    .queryKey(queryKey)
                    .rawQuery("TRENDING")
                    .type(type)
                    .fetchedPages(pagination.getPage())
                    .lastFetchedAt(LocalDateTime.now())
                    .build();
            searchStatusRepository.save(status);
        }

        return catalogRepository.findRelevantItems(type, pagination);
    }

}
