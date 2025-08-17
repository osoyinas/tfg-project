package es.uah.pablopinas.catalog.infrastructure.adapter.controller.dto;

import es.uah.pablopinas.catalog.domain.model.CatalogSearchFilter;
import es.uah.pablopinas.catalog.domain.model.CatalogType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Setter
public class CatalogSearchRequest {

    @Size(min = 3, max = 100, message = "El título no puede tener más de 100 caracteres.")
    private String title;

    private CatalogType type;

    @Size(max = 50, message = "El género no puede tener más de 50 caracteres.")
    private String genre;

    @Min(value = 1800, message = "El año debe ser posterior a 1800.")
    private Integer year;

    private List<String> ids;

    @Min(value = 1800, message = "El año mínimo debe ser posterior a 1800.")
    private Integer min_year;
    @Max(value = 2100, message = "El año máximo no puede ser posterior a 2100.")
    private Integer max_year;
    @Min(value = 0, message = "La calificación mínima debe ser al menos 0.")
    private Double min_rating;
    @Max(value = 5, message = "La calificación máxima no puede ser mayor a 5.")
    private Double max_rating;
    private List<String> genres;

    private String min_release_date;
    private String max_release_date;
    
    public CatalogSearchFilter toFilter() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate minDate = null;
        LocalDate maxDate = null;

        // Check year first, then release date
        if (min_year != null) {
            minDate = LocalDate.of(min_year, 1, 1);
        }
        if (max_year != null) {
            maxDate = LocalDate.of(max_year, 12, 31);
        }

        if (min_release_date != null && !min_release_date.isBlank()) {
            minDate = LocalDate.parse(min_release_date, formatter);
        }
        if (max_release_date != null && !max_release_date.isBlank()) {
            maxDate = LocalDate.parse(max_release_date, formatter);
        }

        return CatalogSearchFilter.builder().titleContains(title).type(type).ids(ids).minReleaseDate(minDate).maxReleaseDate(maxDate).minRating(getMinRating()).maxRating(getMaxRating()).genres(genres).build();
    }

    private Double getMinRating() {
        return min_rating != null ? min_rating * 2 : null;
    }

    private Double getMaxRating() {
        return max_rating != null ? max_rating * 2 : null;
    }
}