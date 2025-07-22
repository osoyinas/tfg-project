package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.exception.CatalogItemNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GetCatalogItemByIdServiceTest {
    private CatalogItemRepositoryPort repository;
    private GetCatalogItemByIdService service;

    @BeforeEach
    void setUp() {
        repository = mock(CatalogItemRepositoryPort.class);
        service = new GetCatalogItemByIdService(repository);
    }

    @Test
    void getById_ShouldReturnItemIfExists() {
        CatalogItem item = CatalogItem.builder().id("1").title("Test").type(CatalogType.MOVIE).build();
        when(repository.findById("1")).thenReturn(Optional.of(item));
        CatalogItem result = service.getById("1");
        assertEquals(item, result);
    }

    @Test
    void getById_ShouldThrowIfNotExists() {
        when(repository.findById("2")).thenReturn(Optional.empty());
        assertThrows(CatalogItemNotFoundException.class, () -> service.getById("2"));
    }
}

