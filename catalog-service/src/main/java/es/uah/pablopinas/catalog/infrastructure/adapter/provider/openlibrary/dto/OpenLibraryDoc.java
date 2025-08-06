package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto;

import java.util.List;

public record OpenLibraryDoc(
        String title,
        List<String> authorName,
        Integer firstPublishYear,
        Integer coverI,
        String firstSentence,
        List<String> subject,
        String key
) {
}
