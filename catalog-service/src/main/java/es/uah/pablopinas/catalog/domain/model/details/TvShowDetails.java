package es.uah.pablopinas.catalog.domain.model.details;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TvShowDetails implements CatalogItemDetails {
    private Integer seasonCount;
    private Integer episodeCount;
    private Integer averageRuntime; // in minutes
    private String originalLanguage;
}
