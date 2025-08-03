package es.uah.pablopinas.catalog.domain.util;

import es.uah.pablopinas.catalog.domain.model.ExternalSourceInfo;

public class CatalogItemIdGenerator {

    public static String fromExternalSource(ExternalSourceInfo externalSource) {
        if (externalSource == null || externalSource.getSourceName() == null || externalSource.getExternalId() == null) {
            throw new IllegalArgumentException("Invalid external source");
        }
        return externalSource.getSourceName().toLowerCase().trim() + ":" + externalSource.getExternalId().trim();
    }
}
