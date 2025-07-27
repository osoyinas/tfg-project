package es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogItemDocument;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class CatalogItemMapper {

    public static CatalogItemDocument toDocument(CatalogItem item) {
        return CatalogItemDocument.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .type(item.getType().toString().toLowerCase())
                .releaseDate(toDate(item.getReleaseDate()))
                .genres(item.getGenres())
                .creators(item.getCreators())
                .images(item.getImages())
                .externalSource(item.getExternalSource())
                .isRelevant(item.isRelevant())
                .relevantUntil(item.getRelevantUntil() != null ? Date.from(item.getRelevantUntil().atZone(ZoneId.systemDefault()).toInstant()) : null)
                .build();
    }

    public static CatalogItem toDomain(CatalogItemDocument doc) {
        return CatalogItem.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .type(CatalogType.fromString(doc.getType()))
                .releaseDate(toLocalDate(doc.getReleaseDate()))
                .genres(doc.getGenres())
                .creators(doc.getCreators())
                .images(doc.getImages())
                .externalSource(doc.getExternalSource())
                .isRelevant(doc.isRelevant())
                .relevantUntil(doc.getRelevantUntil() != null ? doc.getRelevantUntil().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime() : null)
                .build();
    }

    private static Date toDate(LocalDate localDate) {
        if (localDate == null) return null;
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    private static LocalDate toLocalDate(Date date) {
        if (date == null) return null;
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
