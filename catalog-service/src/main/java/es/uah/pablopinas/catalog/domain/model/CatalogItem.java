package es.uah.pablopinas.catalog.domain.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Builder
public class CatalogItem {

    @NonNull
    private String id;
    @NonNull
    @NotBlank
    private String title;
    private String description;
    @NonNull
    private CatalogType type; // e.g., movie, book, series
    private int releaseYear;
    private List<String> genres;
    private List<String> creators;
}
