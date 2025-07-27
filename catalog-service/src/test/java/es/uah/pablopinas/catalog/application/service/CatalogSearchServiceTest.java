package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class SearchCatalogItemsServiceTest {
    private CatalogItemRepositoryPort catalogRepository;
    private ExternalCatalogRepositoryPort externalRepository;
    private CatalogSearchService service;

    @BeforeEach
    void setUp() {
        catalogRepository = mock(CatalogItemRepositoryPort.class);
        externalRepository = mock(ExternalCatalogRepositoryPort.class);
        service = new CatalogSearchService(catalogRepository, externalRepository);
    }

    @Test
    void search_ShouldReturnResultsFromRepository() {
        CatalogSearchFilter filter =
                CatalogSearchFilter.builder()
                        .titleContains("Test")
                        .type(CatalogType.MOVIE)
                        .build();
        PageResult<CatalogItem> page = new PageResult<>(Collections.emptyList(), 0, 10, 0);
        when(catalogRepository.search(filter, new Pagination(0, 10))).thenReturn(page);
        when(externalRepository.fetch(filter, new Pagination(0, 10)))
                .thenReturn(new PageResult<>(Collections.emptyList(), 0, 10, 0));
        PageResult<CatalogItem> result = service.search(filter, new Pagination(0, 10));
        assertEquals(page, result);
    }

    @Test
    void search_ShouldFetchFromExternalIfFilterIsProvided() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .titleContains("Test")
                .type(CatalogType.MOVIE)
                .build();

        CatalogItem externalItem = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        Pagination pagination = new Pagination(0, 10);

        when(externalRepository.fetch(filter, pagination))
                .thenReturn(new PageResult<>(Collections.singletonList(externalItem), 1, 10, 0));
        when(catalogRepository.alreadyExists(externalItem)).thenReturn(false);

        when(catalogRepository.search(filter, pagination)).thenReturn(new PageResult<>(
                Collections.singletonList(externalItem), 1, 10, 0));
        PageResult<CatalogItem> result = service.search(filter, pagination);
        // Assert external repository is called
        verify(externalRepository).fetch(filter, pagination);
        verify(catalogRepository).alreadyExists(externalItem);
        verify(catalogRepository).save(externalItem);

        assertEquals(1, result.items().size());
        verify(catalogRepository).save(externalItem);
    }

    @Test
    void search_ShouldFetchFromExternalIfPageIsGreaterThan0() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .type(CatalogType.MOVIE)
                .build();

        CatalogItem externalItem = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        Pagination pagination = new Pagination(1, 10);

        when(externalRepository.fetch(filter, pagination))
                .thenReturn(new PageResult<>(Collections.singletonList(externalItem), 1, 10, 0));
        when(catalogRepository.alreadyExists(externalItem)).thenReturn(false);

        when(catalogRepository.search(filter, pagination)).thenReturn(new PageResult<>(
                Collections.singletonList(externalItem), 1, 10, 0));
        PageResult<CatalogItem> result = service.search(filter, pagination);
        // Assert external repository is called
        verify(externalRepository).fetch(filter, pagination);
        verify(catalogRepository).alreadyExists(externalItem);
        verify(catalogRepository).save(externalItem);

        assertEquals(1, result.items().size());
        verify(catalogRepository).save(externalItem);
    }

    @Test
    void search_ShouldNotFetchFromExternalIfNoFiltersOrPagination() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .type(CatalogType.MOVIE)
                .build();

        CatalogItem externalItem = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        Pagination pagination = new Pagination(0, 10);

        when(externalRepository.fetch(filter, pagination))
                .thenReturn(new PageResult<>(Collections.singletonList(externalItem), 1, 10, 0));
        when(catalogRepository.alreadyExists(externalItem)).thenReturn(false);

        when(catalogRepository.search(filter, pagination)).thenReturn(new PageResult<>(
                Collections.singletonList(externalItem), 1, 10, 0));
        PageResult<CatalogItem> result = service.search(filter, pagination);
        // Assert external repository is called
        verify(externalRepository, never()).fetch(filter, pagination);
        verify(catalogRepository, never()).alreadyExists(externalItem);
        verify(catalogRepository, never()).save(externalItem);

        assertEquals(1, result.items().size());
    }
}
