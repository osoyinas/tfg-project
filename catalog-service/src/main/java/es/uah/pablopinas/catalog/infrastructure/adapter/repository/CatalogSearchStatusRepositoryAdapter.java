package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model;

import es.uah.pablopinas.catalog.application.port.out.CatalogSearchStatusRepositoryPort;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogSearchStatus;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.SpringDataCatalogItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CatalogSearchStatusRepositoryAdapter implements CatalogSearchStatusRepositoryPort {

    private final SpringDataCatalogItemRepository repository;
    private final MongoTemplate mongoTemplate;

    @Override
    public Optional<CatalogSearchStatus> findByFilter(CatalogSearchFilter filter) {

    }

    @Override
    public void save(CatalogSearchStatus status) {

    }
}
