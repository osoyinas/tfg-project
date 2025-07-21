package es.uah.pablopinas.catalog.domain.port.out;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.PageResult;

import java.util.Optional;

public interface CatalogItemRepositoryPort {

    CatalogItem save(CatalogItem item);

    Optional<CatalogItem> findById(String id);

    void deleteById(String id);

    PageResult<CatalogItem> findAll(int page, int size);

    PageResult<CatalogItem> search(CatalogSearchFilter filter, int page, int size);
}
