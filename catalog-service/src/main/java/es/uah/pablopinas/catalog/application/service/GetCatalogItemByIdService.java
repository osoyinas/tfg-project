package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.application.port.in.GetCatalogItemByIdUseCase;
import es.uah.pablopinas.catalog.application.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetCatalogItemByIdService implements GetCatalogItemByIdUseCase {

    private final CatalogItemRepositoryPort repository;

    @Override
    public Optional<CatalogItem> getById(String id) {
        return repository.findById(id);
    }
}
