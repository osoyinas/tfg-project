package es.uah.pablopinas.catalog.domain.model.details;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MovieDetails implements CatalogItemDetails {
    int durationMinutes;
    String originalLanguage;
}
