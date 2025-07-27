package es.uah.pablopinas.catalog.infrastructure.adapter.repository;

import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogItemDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SpringDataCatalogItemRepository extends MongoRepository<CatalogItemDocument, String> {

    List<CatalogItemDocument> findByType(String type);

    List<CatalogItemDocument> findByGenresContaining(String genre);

    /**
     * Returns true if an item exists with the same external source name and external id.
     */
    boolean existsByExternalSource_SourceNameAndExternalSource_ExternalId(String sourceName, String externalId);
}
