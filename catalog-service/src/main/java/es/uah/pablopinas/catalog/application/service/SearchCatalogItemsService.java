package es.uah.pablopinas.catalog.application.service;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.port.in.SearchCatalogItemsUseCase;
import es.uah.pablopinas.catalog.domain.port.out.CatalogItemRepositoryPort;
import es.uah.pablopinas.catalog.domain.port.out.ExternalCatalogRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchCatalogItemsService implements SearchCatalogItemsUseCase {

    private final CatalogItemRepositoryPort catalogRepository;
    private final ExternalCatalogRepositoryPort externalCatalogRepository;

    @Override
    public PageResult<CatalogItem> search(CatalogSearchFilter filter, int page, int size) {
        PageResult<CatalogItem> result = catalogRepository.search(filter, page, size);

        // If there are no results and both title and type are provided, try to fetch it from the external provider
        boolean isSearchableExternally =
                result.items().isEmpty() &&
                        filter.getTitleContains() != null &&
                        filter.getType() != null;

        if (isSearchableExternally) {
            CatalogType type = filter.getType();

            externalCatalogRepository
                    .fetchItemByTitleAndType(filter.getTitleContains(), type)
                    .ifPresent(catalogRepository::save);
        }

        return catalogRepository.search(filter, page, size);
    }
}
