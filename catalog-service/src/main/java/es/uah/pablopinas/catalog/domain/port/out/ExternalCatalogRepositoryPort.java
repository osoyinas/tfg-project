package es.uah.pablopinas.catalog.domain.port.out;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;

import java.util.Optional;

public interface ExternalCatalogRepositoryPort {

    Optional<CatalogItem> fetchItemByTitleAndType(String title, CatalogType type);
}
