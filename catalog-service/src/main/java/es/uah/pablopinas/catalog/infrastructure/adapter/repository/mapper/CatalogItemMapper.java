package es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogItemDocument;

public class CatalogItemMapper {

    public static CatalogItemDocument toDocument(CatalogItem item) {
        return CatalogItemDocument.builder()
                .id(item.getId())
                .title(item.getTitle())
                .type(item.getType().toString().toLowerCase())
                .releaseYear(item.getReleaseYear())
                .genres(item.getGenres())
                .creators(item.getCreators())
                .averageRating(item.getAverageRating())
                .build();
    }

    public static CatalogItem toDomain(CatalogItemDocument doc) {
        return CatalogItem.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .type(CatalogType.fromString(doc.getType()))
                .releaseYear(doc.getReleaseYear())
                .genres(doc.getGenres())
                .creators(doc.getCreators())
                .averageRating(doc.getAverageRating())
                .build();
    }
}
