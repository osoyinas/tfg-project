package es.uah.pablopinas.catalog.infrastructure.adapter.controller.dto;

import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CatalogSearchRequest {

    @Size(max = 100, message = "El título no puede tener más de 100 caracteres.")
    private String title;

    private CatalogType type;

    @Size(max = 50, message = "El género no puede tener más de 50 caracteres.")
    private String genre;

    @Min(value = 1800, message = "El año debe ser posterior a 1800.")
    private Integer year;

    /**
     * Maps this request DTO into the domain-level CatalogSearchFilter
     */
    public CatalogSearchFilter toFilter() {
        return CatalogSearchFilter.builder()
                .titleContains(title)
                .type(type)
                .genre(genre)
                .releaseYear(year)
                .build();
    }
}
