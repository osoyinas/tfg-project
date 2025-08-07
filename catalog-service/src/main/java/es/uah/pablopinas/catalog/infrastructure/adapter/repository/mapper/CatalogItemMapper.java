package es.uah.pablopinas.catalog.infrastructure.adapter.repository.mapper;

import es.uah.pablopinas.catalog.domain.model.CatalogItem;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import es.uah.pablopinas.catalog.domain.model.details.BookDetails;
import es.uah.pablopinas.catalog.domain.model.details.CatalogItemDetails;
import es.uah.pablopinas.catalog.domain.model.details.MovieDetails;
import es.uah.pablopinas.catalog.domain.util.CatalogItemIdGenerator;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.CatalogItemDocument;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details.BookDetailsDocument;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details.CatalogItemDetailsDocument;
import es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details.MovieDetailsDocument;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class CatalogItemMapper {

    public static CatalogItemDocument toDocument(CatalogItem item) {
        if (item.getId() == null && item.getExternalSource() != null) {
            item.setId(CatalogItemIdGenerator.fromExternalSource(item.getExternalSource()));
        }

        return CatalogItemDocument.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .type(item.getType().toString().toLowerCase())
                .releaseDate(toDate(item.getReleaseDate()))
                .rating(item.getRating())
                .ratingCount(item.getRatingCount())
                .genres(item.getGenres())
                .creators(item.getCreators())
                .images(item.getImages())
                .externalSource(item.getExternalSource())
                .isRelevant(item.isRelevant())
                .relevantUntil(item.getRelevantUntil() != null ? Date.from(item.getRelevantUntil().atZone(ZoneId.systemDefault()).toInstant()) : null)
                .details(toDocumentDetails(item.getDetails()))
                .build();
    }

    public static CatalogItem toDomain(CatalogItemDocument doc) {
        return CatalogItem.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .rating(doc.getRating())
                .ratingCount(doc.getRatingCount())
                .type(CatalogType.fromString(doc.getType()))
                .releaseDate(toLocalDate(doc.getReleaseDate()))
                .genres(doc.getGenres())
                .creators(doc.getCreators())
                .images(doc.getImages())
                .externalSource(doc.getExternalSource())
                .isRelevant(doc.isRelevant())
                .relevantUntil(doc.getRelevantUntil() != null ? doc.getRelevantUntil().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime() : null)
                .details(toDomainDetails(doc.getDetails()))
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

    private static CatalogItemDetails toDomainDetails(CatalogItemDetailsDocument doc) {
        if (doc instanceof BookDetailsDocument book) {
            return BookDetails.builder()
                    .isbn(book.getIsbn())
                    .publisher(book.getPublisher())
                    .pageCount(book.getPageCount())
                    .build();
        }
        if (doc instanceof MovieDetailsDocument movie) {
            return MovieDetails.builder()
                    .durationMinutes(movie.getDurationMinutes())
                    .originalLanguage(movie.getOriginalLanguage())
                    .build();
        }
        return null;
    }

    public static CatalogItemDetailsDocument toDocumentDetails(CatalogItemDetails details) {
        if (details instanceof BookDetails book) {
            return BookDetailsDocument.builder()
                    .isbn(book.getIsbn())
                    .publisher(book.getPublisher())
                    .pageCount(book.getPageCount())
                    .build();
        }
        if (details instanceof MovieDetails movie) {
            return MovieDetailsDocument.builder()
                    .durationMinutes(movie.getDurationMinutes())
                    .originalLanguage(movie.getOriginalLanguage())
                    .build();
        }
        return null;
    }
}
