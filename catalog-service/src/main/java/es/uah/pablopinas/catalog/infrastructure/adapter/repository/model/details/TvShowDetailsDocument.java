package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class TvShowDetailsDocument extends CatalogItemDetailsDocument {
    private Integer seasonCount;
    private Integer episodeCount;
    private Integer averageRuntime; // in minutes
    private String originalLanguage;
}

