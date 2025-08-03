package es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper;

import es.uah.pablopinas.catalog.domain.model.CatalogSearchStatus;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogSearchStatusDocument;

public class CatalogSearchStatusMapper {

    public static CatalogSearchStatusDocument toDocument(CatalogSearchStatus domain) {
        return CatalogSearchStatusDocument.builder()
                .queryKey(domain.getQueryKey())
                .rawQuery(domain.getRawQuery())
                .fetchedPages(domain.getFetchedPages())
                .lastFetchedAt(domain.getLastFetchedAt())
                .build();
    }

    public static CatalogSearchStatus toDomain(CatalogSearchStatusDocument document) {
        return CatalogSearchStatus.builder()
                .queryKey(document.getQueryKey())
                .rawQuery(document.getRawQuery())
                .fetchedPages(document.getFetchedPages())
                .lastFetchedAt(document.getLastFetchedAt())
                .build();
    }
}
