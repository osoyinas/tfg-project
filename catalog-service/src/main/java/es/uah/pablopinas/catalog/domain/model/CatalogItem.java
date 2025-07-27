package es.uah.pablopinas.catalog.domain.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor

@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Builder
public class CatalogItem {
    private String id;
    private String title;
    private String description;
    @NonNull
    private CatalogType type;
    private LocalDate releaseDate;
    private List<String> genres;
    private List<String> creators;
    private ImageSet images;
    private ExternalSourceInfo externalSource;
    private boolean isRelevant;
    private LocalDateTime relevantUntil;
}
