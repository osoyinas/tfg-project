package es.uah.pablopinas.catalog.application.port.out;

import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchStatus;
import es.uah.pablopinas.catalog.domain.model.Pagination;

import java.util.Optional;

public interface CatalogSearchStatusRepositoryPort {
    Optional<CatalogSearchStatus> findByFilterAndPagination(CatalogSearchFilter filter, Pagination pagination);

    void save(CatalogSearchStatus status);

    Optional<CatalogSearchStatus> findByQueryKey(String queryKey);
}
