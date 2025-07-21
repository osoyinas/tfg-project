package es.uah.pablopinas.catalog.domain.port.in;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;

import java.util.Optional;

public interface FetchExternalCatalogItemUseCase {

    Optional<CatalogItem> fetchByTitleAndType(String title, CatalogType type);
}
