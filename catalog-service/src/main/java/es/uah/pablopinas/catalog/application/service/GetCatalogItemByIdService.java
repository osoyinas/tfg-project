package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.port.in.GetCatalogItemByIdUseCase;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.exception.CatalogItemNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetCatalogItemByIdService implements GetCatalogItemByIdUseCase {

    private final CatalogItemRepositoryPort repository;

    @Override
    public CatalogItem getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new CatalogItemNotFoundException(id));
    }
}
