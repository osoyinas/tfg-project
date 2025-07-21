package es.uah.pablopinas.catalog.infrastructure.adapter.provider;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;

import java.util.Optional;

public interface ExternalProviderStrategy {

    boolean supports(CatalogType type);

    Optional<CatalogItem> fetch(String title);
}
