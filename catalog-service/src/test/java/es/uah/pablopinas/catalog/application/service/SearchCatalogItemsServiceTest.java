package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.port.out.ExternalCatalogRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class SearchCatalogItemsServiceTest {
    private CatalogItemRepositoryPort catalogRepository;
    private ExternalCatalogRepositoryPort externalRepository;
    private SearchCatalogItemsService service;

    @BeforeEach
    void setUp() {
        catalogRepository = mock(CatalogItemRepositoryPort.class);
        externalRepository = mock(ExternalCatalogRepositoryPort.class);
        service = new SearchCatalogItemsService(catalogRepository, externalRepository);
    }

    @Test
    void search_ShouldReturnResultsFromRepository() {
        CatalogSearchFilter filter =
                CatalogSearchFilter.builder()
                        .titleContains("Test")
                        .type(CatalogType.MOVIE)
                        .build();
        PageResult<CatalogItem> page = new PageResult<>(Collections.emptyList(), 0, 10, 0);
        when(catalogRepository.search(filter, 0, 10)).thenReturn(page);
        PageResult<CatalogItem> result = service.search(filter, 0, 10);
        assertEquals(page, result);
    }

    @Test
    void search_ShouldFetchFromExternalIfNoResultsAndTitleAndType() {
        CatalogSearchFilter filter = CatalogSearchFilter.builder()
                .titleContains("Test")
                .type(CatalogType.MOVIE)
                .build();
        PageResult<CatalogItem> emptyPage = new PageResult<>(Collections.emptyList(), 0, 10, 0);
        CatalogItem externalItem = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        when(catalogRepository.search(filter, 0, 10)).thenReturn(emptyPage).thenReturn(new PageResult<>(Collections.singletonList(externalItem), 0, 10, 1));
        when(externalRepository.fetchItemByTitleAndType("Test", CatalogType.MOVIE)).thenReturn(Optional.of(externalItem));
        PageResult<CatalogItem> result = service.search(filter, 0, 10);
        assertEquals(1, result.items().size());
        verify(catalogRepository).save(externalItem);
    }
}

