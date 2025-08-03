package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "catalog_search_status")
public class CatalogSearchStatusDocument {

    @Id
    private String queryKey; // hashed key

    private String rawQuery;

    private int fetchedPages;
    private LocalDateTime lastFetchedAt;
}
