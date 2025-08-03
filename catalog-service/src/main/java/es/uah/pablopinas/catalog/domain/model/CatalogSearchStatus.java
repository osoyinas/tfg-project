package es.uah.pablopinas.catalog.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "queryKey")
public class CatalogSearchStatus {

    private String queryKey;

    private String rawQuery;
    private CatalogType type;

    private int fetchedPages;
    private LocalDateTime lastFetchedAt;
}
