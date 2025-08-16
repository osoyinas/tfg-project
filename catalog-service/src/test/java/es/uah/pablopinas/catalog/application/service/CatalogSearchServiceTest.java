package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogFetchQueuePort;
import es.uah.pablopinas.catalog.domain.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CatalogSearchServiceTest {

    private CatalogItemRepositoryPort catalogRepository;
    private CatalogSearchStatusRepositoryPort searchStatusRepository;
    private ExternalCatalogFetchQueuePort externalFetchQueue;
    private CatalogSearchService service;

    @BeforeEach
    void setUp() {
        catalogRepository = mock(CatalogItemRepositoryPort.class);
        searchStatusRepository = mock(CatalogSearchStatusRepositoryPort.class);
        externalFetchQueue = mock(ExternalCatalogFetchQueuePort.class);

        service = new CatalogSearchService(
                catalogRepository,
                searchStatusRepository,
                externalFetchQueue
        );
    }

    @Test
    void search_ShouldReturnResultsFromRepository() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .titleContains("Test")
                .type(CatalogType.MOVIE)
                .minReleaseDate(null)
                .maxReleaseDate(null)
                .build();
        Pagination pagination = new Pagination(0, 10);

        PageResult<CatalogItem> expectedPage = new PageResult<>(Collections.emptyList(), 0, 10);

        when(catalogRepository.search(filter, pagination)).thenReturn(expectedPage);
        when(searchStatusRepository.findByQueryKey(anyString())).thenReturn(Optional.of(
                CatalogSearchStatus.builder()
                        .fetchedPages(1)
                        .lastFetchedAt(LocalDateTime.now())
                        .build()
        ));
        // Mock fetchAndCache to return expectedPage when local is empty
        when(externalFetchQueue.fetchAndCache(filter, pagination)).thenReturn(expectedPage);

        PageResult<CatalogItem> result = service.search(filter, pagination);

        assertEquals(expectedPage, result);
        verify(externalFetchQueue).fetchAndCache(filter, pagination);
        verify(externalFetchQueue, never()).enqueueFetch(any(), any());
    }

    @Test
    void search_ShouldFetchAndCacheIfNoLocalDataAndNeverFetched() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .titleContains("Test")
                .type(CatalogType.MOVIE)
                .minReleaseDate(null)
                .maxReleaseDate(null)
                .build();
        Pagination pagination = new Pagination(0, 10);

        PageResult<CatalogItem> fetchedPage = new PageResult<>(Collections.emptyList(), 0, 10);

        when(catalogRepository.search(filter, pagination)).thenReturn(new PageResult<>(Collections.emptyList(), 0, 10));
        when(searchStatusRepository.findByQueryKey(anyString())).thenReturn(Optional.empty());
        when(externalFetchQueue.fetchAndCache(filter, pagination)).thenReturn(fetchedPage);

        PageResult<CatalogItem> result = service.search(filter, pagination);

        assertEquals(fetchedPage, result);
        verify(externalFetchQueue).fetchAndCache(filter, pagination);
        verify(externalFetchQueue, never()).enqueueFetch(any(), any());
    }

    @Test
    void search_ShouldEnqueueIfStaleOrMissingPages() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .titleContains("Test")
                .type(CatalogType.MOVIE)
                .minReleaseDate(null)
                .maxReleaseDate(null)
                .build();
        Pagination pagination = new Pagination(2, 10);

        when(catalogRepository.search(filter, pagination)).thenReturn(new PageResult<>(Collections.singletonList(
                CatalogItem.builder().id("123").type(CatalogType.MOVIE).title("X").build()
        ), 2, 10));

        when(searchStatusRepository.findByQueryKey(anyString())).thenReturn(Optional.of(
                CatalogSearchStatus.builder()
                        .fetchedPages(1)
                        .lastFetchedAt(LocalDateTime.now().minusDays(8))
                        .build()
        ));

        service.search(filter, pagination);

        verify(externalFetchQueue).enqueueFetch(filter, pagination);
        verify(externalFetchQueue, never()).fetchAndCache(any(), any());
    }

    @Test
    void search_ShouldNotEnqueueIfFreshAndComplete() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .titleContains("Test")
                .type(CatalogType.MOVIE)
                .minReleaseDate(null)
                .maxReleaseDate(null)
                .build();
        Pagination pagination = new Pagination(0, 10);

        when(catalogRepository.search(filter, pagination)).thenReturn(new PageResult<>(Collections.singletonList(
                CatalogItem.builder().id("abc").type(CatalogType.MOVIE).title("Cached").build()
        ), 0, 10));

        when(searchStatusRepository.findByQueryKey(anyString())).thenReturn(Optional.of(
                CatalogSearchStatus.builder()
                        .fetchedPages(5)
                        .lastFetchedAt(LocalDateTime.now())
                        .build()
        ));

        service.search(filter, pagination);

        verify(externalFetchQueue, never()).fetchAndCache(any(), any());
        verify(externalFetchQueue, never()).enqueueFetch(any(), any());
    }
}
