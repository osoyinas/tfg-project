package es.uah.pablopinas.catalog.application.port.out;

import es.uah.pablopinas.catalog.domain.model.*;

import java.util.Optional;

public interface CatalogItemRepositoryPort {

    CatalogItem save(CatalogItem item);

    Boolean alreadyExists(CatalogItem item);

    Optional<CatalogItem> findById(String id);
    
    void deleteById(String id);

    PageResult<CatalogItem> findAll(int page, int size);

    PageResult<CatalogItem> search(CatalogSearchFilter filter, Pagination pagination);

    PageResult<CatalogItem> findRelevantItems(CatalogType type, Pagination pagination);

    CatalogItem update(String id, CatalogItem item);
}
