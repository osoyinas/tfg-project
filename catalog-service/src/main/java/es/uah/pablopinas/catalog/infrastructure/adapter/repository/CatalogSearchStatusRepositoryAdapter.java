package es.uah.pablopinas.catalog.infrastructure.adapter.repository;

import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchStatus;
import es.uah.pablopinas.catalog.domain.model.Pagination;
import es.uah.pablopinas.catalog.domain.util.QueryKeyUtil;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper.CatalogSearchStatusMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CatalogSearchStatusRepositoryAdapter implements CatalogSearchStatusRepositoryPort {

    private final SpringDataCatalogSearchStatusRepository searchStatusRepository;

    @Override
    public Optional<CatalogSearchStatus> findByFilterAndPagination(CatalogSearchFilter filter, Pagination pagination) {
        String queryKey = QueryKeyUtil.buildKey(filter, pagination);
        return searchStatusRepository.findById(queryKey)
                .map(CatalogSearchStatusMapper::toDomain);
    }

    @Override
    public void save(CatalogSearchStatus status) {
        searchStatusRepository.save(CatalogSearchStatusMapper.toDocument(status));
    }

    @Override
    public Optional<CatalogSearchStatus> findByQueryKey(String queryKey) {
        return Optional.empty();
    }
}
