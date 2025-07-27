package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.CreateCatalogItemUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateCatalogItemService implements CreateCatalogItemUseCase {

    private final CatalogItemRepositoryPort repository;

    @Override
    public CatalogItem create(CatalogItem item) {
        if (repository.alreadyExists(item)) {
            return repository.findById(item.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Item already exists and cannot be created again"));
        }
        return repository.save(item);
    }
}
