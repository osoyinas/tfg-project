package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary;

import com.nimbusds.jose.shaded.gson.JsonElement;
import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibraryDoc;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibrarySubjectWork;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto.OpenLibraryWorkDetail;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Component
public class OpenLibraryBookMapper {

    private static final String SOURCE_NAME = "OPEN_LIBRARY";
    private static final String COVER_BASE_URL = "https://covers.openlibrary.org/b/id/";
    private static final Logger log = LoggerFactory.getLogger(OpenLibraryBookMapper.class);

    private final OpenLibrarySearchClient searchClient;

    public CatalogItem fromSearchDoc(OpenLibraryDoc doc) {
        CatalogItem base = CatalogItem.builder()
                .id("open_library:" + doc.key())
                .title(doc.title())
                .description("No description available.")
                .type(CatalogType.BOOK)
                .releaseDate(parseYear(doc.firstPublishYear()))
                .creators(doc.authorName() != null ? doc.authorName() : List.of())
                .genres(List.of())
                .externalSource(ExternalSourceInfo.builder()
                        .sourceName(SOURCE_NAME)
                        .externalId(doc.key())
                        .build())
                .build();

        try {
            OpenLibraryWorkDetail detail = searchClient.fetchWorkDetail(doc.key());
            enrichWithWorkDetail(base, detail);

            if ((base.getImages() == null || base.getImages().getCover() == null)
                    && detail.covers() != null && !detail.covers().isEmpty()) {
                base.setImages(getImageSetFromCovers(detail.covers()));
            }
        } catch (IOException e) {
            log.warn("Failed to fetch work detail for {}: {}", doc.key(), e.getMessage());
        }

        return base;
    }


    public CatalogItem fromSubjectWork(OpenLibrarySubjectWork work) {
        CatalogItem base = CatalogItem.builder()
                .id("open_library:" + work.key())
                .title(work.title())
                .description("No description available.")
                .type(CatalogType.BOOK)
                .releaseDate(parseYear(work.firstPublishYear()))
                .creators(work.authors() != null
                        ? work.authors().stream()
                        .map(OpenLibrarySubjectWork.Author::name)
                        .filter(Objects::nonNull)
                        .toList()
                        : List.of())
                .genres(limitSubjects(work.subject()))
                .externalSource(ExternalSourceInfo.builder()
                        .sourceName(SOURCE_NAME)
                        .externalId(work.key())
                        .build())
                .build();

        try {
            OpenLibraryWorkDetail detail = searchClient.fetchWorkDetail(work.key());
            enrichWithWorkDetail(base, detail);

            // If the images were not provided in the subject, try to extract them from the detail
            if ((base.getImages() == null || base.getImages().getCover() == null)
                    && detail.covers() != null && !detail.covers().isEmpty()) {
                base.setImages(getImageSetFromCovers(detail.covers()));
            }
        } catch (IOException e) {
            log.warn("Failed to fetch subject work detail for {}: {}", work.key(), e.getMessage());
        }

        return base;
    }


    public CatalogItem enrichWithWorkDetail(CatalogItem base, OpenLibraryWorkDetail detail) {
        if (detail == null) return base;

        base.setDescription(parseDescription(detail.description()));
        base.setGenres(limitSubjects(detail.subject()));

        // YA NO se sobrescriben las imágenes aquí

        if (detail.authors() != null) {
            var authorNames = detail.authors().stream()
                    .map(a -> a.author().key())
                    .map(this::extractAuthorFromKeyOnly)
                    .filter(Objects::nonNull)
                    .toList();
            base.setCreators(authorNames);
        }

        return base;
    }

    private String parseDescription(JsonElement descriptionElement) {
        if (descriptionElement == null || descriptionElement.isJsonNull()) {
            return "No description available.";
        }
        if (descriptionElement.isJsonPrimitive()) {
            return descriptionElement.getAsString();
        }
        if (descriptionElement.isJsonObject() && descriptionElement.getAsJsonObject().has("value")) {
            return descriptionElement.getAsJsonObject().get("value").getAsString();
        }
        return "No description available.";
    }

    private List<String> limitSubjects(List<String> subjects) {
        return subjects != null ? subjects.stream().limit(5).toList() : List.of();
    }

    private ImageSet getImageSetFromCovers(List<Integer> coverIds) {
        if (coverIds == null || coverIds.isEmpty()) return null;
        Integer coverId = coverIds.get(0);
        return ImageSet.builder()
                .cover(new Image(COVER_BASE_URL + coverId + "-L.jpg", "Cover"))
                .poster(new Image(COVER_BASE_URL + coverId + "-M.jpg", "Poster"))
                .build();
    }

    private LocalDate parseYear(Integer year) {
        return (year != null) ? LocalDate.of(year, 1, 1) : null;
    }

    private String extractAuthorFromKeyOnly(String authorKey) {
        if (authorKey == null) return null;
        return "Author " + authorKey.substring(authorKey.lastIndexOf('/') + 1);
    }
}
