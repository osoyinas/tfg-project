package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.domain.model.details.BookDetails;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibraryDoc;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibraryWorkDetail;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Component
public class OpenLibraryBookMapper {

    private static final String SOURCE_NAME = "OPEN_LIBRARY";
    private static final String COVER_BASE_URL = "https://covers.openlibrary.org/b/id/";
    private static final String COVER_BASE_URL_ISBN = "https://covers.openlibrary.org/b/isbn/";
    private static final Logger log = LoggerFactory.getLogger(OpenLibraryBookMapper.class);


    public CatalogItem fromSearchDoc(OpenLibraryDoc doc) {
        CatalogItem base = CatalogItem.builder()
                .id("open_library:" + extractExternalId(doc.key()))
                .title(doc.title())
                .description("No description available.") // Temporaly, async enrichment will be added later
                .type(CatalogType.BOOK)
                .releaseDate(parseYear(doc.first_publish_year()))
                .creators(doc.author_name() != null ? doc.author_name() : List.of())
                .genres(limitSubjects(doc.subject()))
                .images(
                        doc.cover_i() != null
                                ? getImageSetFromCoverI(doc.cover_i())
                                : (doc.isbn() != null && !doc.isbn().isEmpty())
                                ? getImageSetFromIsbn(doc.isbn().get(0))
                                : null
                )
                .rating(scaleTo10(doc.ratings_average()))
                .ratingCount(doc.ratings_count())
                .details(BookDetails.builder()
                        .isbn(firstOrNull(doc.isbn()))
                        .publisher(firstOrNull(doc.publisher()))
                        .pageCount(doc.number_of_pages_median())
                        .build()
                )
                .externalSource(ExternalSourceInfo.builder()
                        .sourceName(SOURCE_NAME)
                        .externalId(extractExternalId(doc.key()))
                        .externalUrl("https://openlibrary.org" + doc.key())
                        .build())
                .build();

        return base;
    }

    private String extractExternalId(String key) {
        if (key == null || !key.startsWith("/works/OL")) return key;
        return key.split("/")[2]; // OL1234567
    }

    private List<String> limitSubjects(List<String> subjects) {
        return subjects != null ? subjects.stream().limit(5).toList() : List.of();
    }

    private ImageSet getImageSetFromCoverI(Integer coverI) {
        if (coverI == null) return null;
        return ImageSet.builder()
                .cover(new Image(COVER_BASE_URL + coverI + "-L.jpg", "Cover"))
                .poster(new Image(COVER_BASE_URL + coverI + "-M.jpg", "Poster"))
                .thumbnail(new Image(COVER_BASE_URL + coverI + "-S.jpg", "Thumbnail"))
                .build();
    }

    private ImageSet getImageSetFromIsbn(String isbn) {

        return ImageSet.builder()
                .cover(new Image(COVER_BASE_URL_ISBN + isbn + "-L.jpg", "Cover"))
                .poster(new Image(COVER_BASE_URL_ISBN + isbn + "-M.jpg", "Poster"))
                .thumbnail(new Image(COVER_BASE_URL_ISBN + isbn + "-S.jpg", "Thumbnail"))
                .build();
    }

    private LocalDate parseYear(Integer year) {
        return (year != null) ? LocalDate.of(year, 1, 1) : null;
    }

    private static String firstOrNull(List<String> list) {
        return (list != null && !list.isEmpty()) ? list.get(0) : null;
    }

    // Open Library puede dar ratings sobre 5 estrellas; si ya es sobre 10, no escales.
    // Ajusta esta lógica según lo que estés pidiendo en `fields`.
    private Double scaleTo10(Double ratingsAverage) {
        if (ratingsAverage == null) return null;
        // Si quieres confiar en 0..5 -> 0..10:
        double scaled = ratingsAverage * 2.0;
        return Math.min(10.0, Math.max(0.0, scaled));
    }

    public CatalogItem enrichWithWorkDetail(CatalogItem item, OpenLibraryWorkDetail doc) {
        item.setDescription(doc.extractDescription());
        return item;
    }
}
