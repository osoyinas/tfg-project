package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CatalogItemCRUDServiceTest {

    private CatalogItemRepositoryPort repository;
    private CatalogItemCRUDService service;
    private CatalogItem item;

    @BeforeEach
    void setUp() {
        repository = mock(CatalogItemRepositoryPort.class);
        service = new CatalogItemCRUDService(repository);
        item = CatalogItem.builder().id("123").title("Test Item").type(CatalogType.MOVIE).build();
    }

    @Test
    void create_shouldSaveNewItemIfNotExists() {
        when(repository.alreadyExists(item)).thenReturn(false);
        when(repository.save(item)).thenReturn(item);

        CatalogItem result = service.create(item);

        assertEquals(item, result);
        verify(repository).save(item);
    }

    @Test
    void create_existing_shouldReturnExistingItem() {
        when(repository.alreadyExists(item)).thenReturn(true);
        when(repository.findById(item.getId())).thenReturn(Optional.of(item));

        CatalogItem result = service.create(item);

        assertEquals(item, result);
        verify(repository, never()).save(any());
    }

    @Test
    void deleteById_shouldDeleteItem() {
        service.deleteById("123");

        verify(repository).deleteById("123");
    }

    @Test
    void getById_shouldReturnItem() {
        when(repository.findById("123")).thenReturn(Optional.of(item));

        Optional<CatalogItem> result = service.getById("123");

        assertEquals(Optional.of(item), result);
    }
}
