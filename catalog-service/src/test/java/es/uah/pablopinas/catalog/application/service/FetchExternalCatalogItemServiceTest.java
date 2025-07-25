package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.port.out.ExternalCatalogRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FetchExternalCatalogItemServiceTest {
    private ExternalCatalogRepositoryPort externalRepo;
    private FetchExternalCatalogItemService service;

    @BeforeEach
    void setUp() {
        externalRepo = mock(ExternalCatalogRepositoryPort.class);
        service = new FetchExternalCatalogItemService(externalRepo);
    }

    @Test
    void fetchByTitleAndType_ShouldReturnItemIfExists() {
        CatalogItem item = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        when(externalRepo.fetchItemByTitleAndType("Test", CatalogType.MOVIE)).thenReturn(Optional.of(item));
        Optional<CatalogItem> result = service.fetchByTitleAndType("Test", CatalogType.MOVIE);
        assertTrue(result.isPresent());
        assertEquals(item, result.get());
    }

    @Test
    void fetchByTitleAndType_ShouldReturnEmptyIfNotExists() {
        when(externalRepo.fetchItemByTitleAndType("Test", CatalogType.MOVIE)).thenReturn(Optional.empty());
        Optional<CatalogItem> result = service.fetchByTitleAndType("Test", CatalogType.MOVIE);
        assertFalse(result.isPresent());
    }
}

