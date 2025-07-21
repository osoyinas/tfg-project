package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.port.in.FetchExternalCatalogItemUseCase;
import es.uah.pablopinas.catalog.domain.port.out.ExternalCatalogRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FetchExternalCatalogItemService implements FetchExternalCatalogItemUseCase {

    private final ExternalCatalogRepositoryPort externalCatalogRepository;

    @Override
    public Optional<CatalogItem> fetchByTitleAndType(String title, CatalogType type) {
        return externalCatalogRepository.fetchItemByTitleAndType(title, type);
    }
}
