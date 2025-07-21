package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String type;
    private int releaseYear;
    private List<String> genres;
    private List<String> creators;
    private double averageRating;
}
