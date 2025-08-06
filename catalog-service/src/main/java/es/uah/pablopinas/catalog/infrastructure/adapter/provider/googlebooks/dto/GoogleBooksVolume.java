package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks.dto;

import java.util.List;

public record GoogleBooksVolume(
        String id,
        VolumeInfo volumeInfo
) {

    public record VolumeInfo(
            String title,
            List<String> authors,
            String publishedDate,
            String description,
            List<String> categories,
            ImageLinks imageLinks
    ) {
    }

    public record ImageLinks(
            String smallThumbnail,
            String thumbnail
    ) {
    }
}
