package es.uah.pablopinas.catalog.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CatalogSearchFilter {
    String titleContains;
    CatalogType type;
    String genre;
    Integer releaseYear;
}
