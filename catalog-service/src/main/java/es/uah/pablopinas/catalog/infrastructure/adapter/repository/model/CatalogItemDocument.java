package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model;

import es.uah.pablopinas.catalog.domain.model.ExternalSourceInfo;
import es.uah.pablopinas.catalog.domain.model.ImageSet;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "catalog_items")
public class CatalogItemDocument {

    @Id
    private String id;

    private String title;
    private String description;
    private String type;
    private Date releaseDate;
    private List<String> genres;
    private List<String> creators;
    private double averageRating;

    private ImageSet images;

    private ExternalSourceInfo externalSource;

    private boolean isRelevant;
    private Date relevantUntil;
}
