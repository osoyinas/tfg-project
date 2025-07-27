package es.uah.pablopinas.catalog.domain.port.in;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.model.PageResult;
import es.uah.pablopinas.catalog.domain.model.Pagination;

public interface GetRelevantCatalogItemsUseCase {

    PageResult<CatalogItem> getRelevantCatalogItems(CatalogType type, Pagination pagination);
}
