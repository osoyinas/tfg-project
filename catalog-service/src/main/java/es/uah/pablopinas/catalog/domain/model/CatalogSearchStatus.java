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

    /**
     * Representación única de la búsqueda: puede ser el texto de búsqueda en minúsculas + tipo (BOOK/MOVIE/TV_SERIE).
     */
    private String queryKey;

    private String rawQuery; // el texto original de búsqueda, opcional
    private CatalogType type;

    private int fetchedPages;
    private LocalDateTime lastFetchedAt;

    // Si quieres: última página total detectada desde el proveedor
    private int totalPages;
}
