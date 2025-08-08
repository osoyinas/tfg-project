package es.uah.pablopinas.catalog.domain.model;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class CatalogSearchFilter {
    String titleContains;
    CatalogType type;
    String genre;
    Integer releaseYear;
    List<String> ids;

    /**
     * Checks if the filter is empty, meaning no search criteria is set.
     *
     * @return true if all fields except type are null, false otherwise
     */
    public boolean isEmpty() {
        return titleContains == null &&
                genre == null &&
                releaseYear == null &&
                (ids == null || ids.isEmpty()) &&
                type == null;
    }
}
