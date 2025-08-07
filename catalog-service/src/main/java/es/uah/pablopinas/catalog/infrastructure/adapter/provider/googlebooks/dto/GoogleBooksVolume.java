package es.uah.pablopinas.catalog.infrastructure.adapter.provider.googlebooks.dto;

import java.util.List;

public record GoogleBooksVolume(
        String id,
        VolumeInfo volumeInfo
) {

    public record VolumeInfo(
            String title,
            List<String> authors,
            String publisher,
            String publishedDate,
            String description,
            List<IndustryIdentifier> industryIdentifiers,
            List<String> categories,
            ImageLinks imageLinks,
            Integer pageCount,
            Double averageRating,
            Integer ratingsCount
    ) {
    }

    public record IndustryIdentifier(
            String type,
            String identifier
    ) {
    }

    public record ImageLinks(
            String smallThumbnail,
            String thumbnail
    ) {
    }

    public record AccessInfo(
            Epub epub,
            Pdf pdf
    ) {
    }

    public record Epub(
            boolean isAvailable
    ) {
    }

    public record Pdf(
            boolean isAvailable
    ) {
    }
}
