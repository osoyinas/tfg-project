package es.uah.pablopinas.catalog.infrastructure.adapter;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.port.out.ExternalCatalogRepositoryPort;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ExternalCatalogRepositoryImpl implements ExternalCatalogRepositoryPort {

    private final List<ExternalProviderStrategy> strategies;

    @Override
    public Optional<CatalogItem> fetchItemByTitleAndType(String title, CatalogType type) {
        return strategies.stream()
                .filter(provider -> provider.supports(type))
                .findFirst()
                .flatMap(provider -> provider.fetch(title));
    }
}
