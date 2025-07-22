package es.uah.pablopinas.catalog.domain.model;

import java.util.List;


public record PageResult<T>(List<T> items, int page, int size, long totalItems) {
}
