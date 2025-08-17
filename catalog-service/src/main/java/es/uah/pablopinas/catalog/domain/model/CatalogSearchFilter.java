package es.uah.pablopinas.catalog.domain.model;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;
import java.util.List;

@Value
@Builder
public class CatalogSearchFilter {
    String titleContains;
    CatalogType type;
    List<String> ids;
    LocalDate minReleaseDate;
    LocalDate maxReleaseDate;
    Double minRating;
    Double maxRating;
    List<String> genres;

    public boolean isEmpty() {
        return titleContains == null &&
                (ids == null || ids.isEmpty()) &&
                type == null &&
                minReleaseDate == null &&
                maxReleaseDate == null &&
                minRating == null &&
                maxRating == null &&
                (genres == null || genres.isEmpty());
    }
}