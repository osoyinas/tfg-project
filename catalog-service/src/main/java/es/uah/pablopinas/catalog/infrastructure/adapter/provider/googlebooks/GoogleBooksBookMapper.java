package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks;

import es.uah.pablopinas.catalog.domain.model.*;
import es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks.dto.GoogleBooksVolume;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleBooksBookMapper {

    private static final String SOURCE_NAME = "GOOGLE_BOOKS";

    private final GenresTranslator genresTranslator;

    public CatalogItem toCatalogItemBasic(GoogleBooksVolume volume) {
        var info = volume.volumeInfo();
        return CatalogItem.builder()
                .id(SOURCE_NAME.toLowerCase() + ":" + volume.id())
                .title(info.title())
                .description(null)
                .type(CatalogType.BOOK)
                .releaseDate(parseDate(info.publishedDate()))
                .creators(info.authors() != null ? info.authors() : List.of())
                .genres(List.of())
                .images(extractImages(info.imageLinks()))
                .externalSource(ExternalSourceInfo.builder()
                        .sourceName(SOURCE_NAME)
                        .externalId(volume.id())
                        .build())
                .build();
    }

    public CatalogItem enrich(CatalogItem item, GoogleBooksVolume volume) {
        var info = volume.volumeInfo();
        item.setDescription(Optional.ofNullable(info.description()).orElse("No description available."));
        if (info.categories() != null) {
            item.setGenres(genresTranslator.translateCategories(info.categories(), 10));
        }
        if (info.authors() != null && !info.authors().isEmpty()) {
            item.setCreators(info.authors());
        }
        return item;
    }

    private LocalDate parseDate(String publishedDate) {
        try {
            if (publishedDate == null) return null;
            if (publishedDate.length() == 4) {
                return LocalDate.of(Integer.parseInt(publishedDate), 1, 1);
            }
            if (publishedDate.length() >= 7) {
                String[] parts = publishedDate.split("-");
                return LocalDate.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), 1);
            }
        } catch (Exception e) {
            log.warn("Could not parse date: {}", publishedDate);
        }
        return null;
    }

    private ImageSet extractImages(GoogleBooksVolume.ImageLinks links) {
        if (links == null || links.thumbnail() == null) return null;
        return ImageSet.builder()
                .cover(new Image(links.thumbnail(), "Cover"))
                .poster(new Image(links.thumbnail(), "Poster"))
                .thumbnail(new Image(links.smallThumbnail(), "Thumbnail"))
                .build();
    }

}

