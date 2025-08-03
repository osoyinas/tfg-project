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
        if (filter.getType() != null) {
            return strategies.stream()
                    .filter(strategy -> strategy.supports(filter.getType()))
                    .findFirst()
                    .map(strategy -> strategy.fetch(filter, pagination))
                    .orElse(PageResult.empty(pagination));
        }

        // If no type is specified, combine results from all strategies
        List<CatalogItem> combined = strategies.stream()
                .map(strategy -> strategy.fetch(filter, pagination))
                .flatMap(page -> page.items().stream())
                .toList();
        return PageResult.of(combined, pagination);
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
