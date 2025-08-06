package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto;

import java.util.List;

public record OpenLibrarySubjectWork(
        String key,
        String title,
        Integer coverId,
        Integer firstPublishYear,
        List<Author> authors,
        List<String> subject
) {
    public record Author(String key, String name) {
    }
}
