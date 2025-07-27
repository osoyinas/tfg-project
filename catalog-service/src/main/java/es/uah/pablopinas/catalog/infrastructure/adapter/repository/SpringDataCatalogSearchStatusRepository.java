package es.uah.pablopinas.catalog.infrastructure.adapter.repository;

import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogSearchStatusDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SpringDataCatalogSearchStatusRepository extends MongoRepository<CatalogSearchStatusDocument, String> {
}
