package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class MovieDetailsDocument extends CatalogItemDetailsDocument {
    private int durationMinutes;
    private String director;
    private String originalLanguage;
}

