package es.uah.pablopinas.catalog.infrastructure.adapter.provider.openlibrary.dto;

import java.util.List;

public record OpenLibraryDoc(
        String title,
        List<String> author_name,
        Integer first_publish_year,
        Integer cover_i,
        List<String> subject,
        String key,
        Double ratings_average,
        Integer ratings_count,
        List<String> isbn,
        List<String> publisher,
        Integer number_of_pages_median
) {
}
