package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.port.in.CreateCatalogItemUseCase;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateCatalogItemService implements CreateCatalogItemUseCase {

    private final CatalogItemRepositoryPort repository;

    @Override
    public CatalogItem create(CatalogItem item) {
        return repository.save(item);
    }
}
