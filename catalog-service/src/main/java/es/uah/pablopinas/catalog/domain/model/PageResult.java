package es.uah.pablopinas.catalog.domain.model;

import java.util.List;


public record PageResult<T>(List<T> items, int page, int size, long totalItems, long totalPages) {

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public static <T> PageResult<T> empty(int page, int size) {
        return new PageResult<>(List.of(), page, size, 0, 0);
    }

    public static <T> PageResult<T> empty(Pagination pagination) {
        return empty(pagination.getPage(), pagination.getSize());
    }
}
