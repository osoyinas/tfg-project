package es.uah.pablopinas.catalog.application.port.out;

import es.uah.pablopinas.catalog.domain.model.*;

public interface ExternalCatalogRepositoryPort {

    PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination);

    PageResult<CatalogItem> fetchTrending(CatalogType type, Pagination pagination);
}
