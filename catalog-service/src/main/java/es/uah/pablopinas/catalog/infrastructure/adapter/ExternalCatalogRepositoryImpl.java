package es.uah.pablopinas.catalog.infrastructure.adapter;

import es.uah.pablopinas.catalog.application.port.out.ExternalCatalogRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.ExternalProviderStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ExternalCatalogRepositoryImpl implements ExternalCatalogRepositoryPort {

    private final List<ExternalProviderStrategy> strategies;

    @Override
    public PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination) {
        return strategies.stream()
                .filter(provider -> provider.supports(filter.getType()))
                .findFirst()
                .map(provider -> provider.fetch(filter, pagination))
                .orElse(PageResult.empty(pagination));
    }

    @Override
    public PageResult<CatalogItem> fetchTrending(CatalogType type, Pagination pagination) {
        return strategies.stream()
                .filter(provider -> provider.supports(type))
                .findFirst()
                .map(provider -> provider.fetchTrending(pagination))
                .orElse(PageResult.empty(pagination));
    }
}
