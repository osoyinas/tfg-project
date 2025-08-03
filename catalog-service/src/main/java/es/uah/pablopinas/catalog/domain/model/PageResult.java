package es.uah.pablopinas.catalog.domain.model;

import java.util.List;


public record PageResult<T>(List<T> items, int page, int size) {

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public static <T> PageResult<T> empty(int page, int size) {
        return new PageResult<>(List.of(), page, size);
    }

    public static <T> PageResult<T> empty(Pagination pagination) {
        return empty(pagination.getPage(), pagination.getSize());
    }

    public static <T> PageResult<T> of(List<T> items, Pagination pagination) {
        return new PageResult<>(items, pagination.getPage(), pagination.getSize());
    }

    public static <T> PageResult<T> of(List<T> items, int page, int size) {
        return new PageResult<>(items, page, size);
    }
}
