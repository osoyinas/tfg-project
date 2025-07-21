package es.uah.pablopinas.catalog.domain.port.in;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;

public interface CreateCatalogItemUseCase {

    CatalogItem create(CatalogItem item);
}
