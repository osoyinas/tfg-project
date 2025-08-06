package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto;

import java.util.List;

public record OpenLibrarySearchResult(
        List<OpenLibraryDoc> docs
) {
}

