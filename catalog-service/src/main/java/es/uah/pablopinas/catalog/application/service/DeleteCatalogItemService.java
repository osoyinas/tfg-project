package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.port.in.DeleteCatalogItemUseCase;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteCatalogItemService implements DeleteCatalogItemUseCase {

    private final CatalogItemRepositoryPort repository;

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
