package es.uah.pablopinas.catalog.application.port.in;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;

import java.util.Optional;

public interface GetCatalogItemByIdUseCase {

    Optional<CatalogItem> getById(String id);
}
