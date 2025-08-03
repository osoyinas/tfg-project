package es.uah.pablopinas.catalog.infrastructure.adapter.controller.dto;

import es.uah.pablopinas.catalog.domain.model.Pagination;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginationRequest {

    @Min(value = 0, message = "La página no puede ser menor que 0.")
    private int page = 0;

    @Min(value = 1, message = "El tamaño mínimo permitido es 1.")
    @Max(value = 100, message = "El tamaño máximo permitido es 100.")
    private int size = 20;

    public Pagination toDomain() {
        return new es.uah.pablopinas.catalog.domain.model.Pagination(page, size);
    }
}
