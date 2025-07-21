package es.uah.pablopinas.catalog.domain.port.in;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.PageResult;

public interface SearchCatalogItemsUseCase {

    PageResult<CatalogItem> search(CatalogSearchFilter filter, int page, int size);
}
