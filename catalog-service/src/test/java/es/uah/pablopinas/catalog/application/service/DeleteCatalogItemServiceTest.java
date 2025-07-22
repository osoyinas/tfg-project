package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.*;

class DeleteCatalogItemServiceTest {
    private CatalogItemRepositoryPort repository;
    private DeleteCatalogItemService service;

    @BeforeEach
    void setUp() {
        repository = mock(CatalogItemRepositoryPort.class);
        service = new DeleteCatalogItemService(repository);
    }

    @Test
    void deleteById_ShouldCallRepository() {
        String id = "1";
        service.deleteById(id);
        verify(repository).deleteById(id);
    }
}

