package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.*;

public interface ExternalProviderStrategy {

    boolean supports(CatalogType type);

    PageResult<CatalogItem> fetch(CatalogSearchFilter filter, Pagination pagination);

    PageResult<CatalogItem> fetchTrending(Pagination pagination);
}
