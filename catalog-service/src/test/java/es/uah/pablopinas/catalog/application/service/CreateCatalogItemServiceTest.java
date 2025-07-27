package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CreateCatalogItemServiceTest {
    private CatalogItemRepositoryPort repository;
    private CreateCatalogItemService service;

    @BeforeEach
    void setUp() {
        repository = mock(CatalogItemRepositoryPort.class);
        service = new CreateCatalogItemService(repository);
    }

    @Test
    void create_ShouldSaveAndReturnCatalogItem() {
        CatalogItem item = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        when(repository.save(item)).thenReturn(item);
        CatalogItem result = service.create(item);
        assertEquals(item, result);
        verify(repository).save(item);
    }
}

