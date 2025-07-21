package es.uah.pablopinas.catalog.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PageResult<T> {
    private final List<T> items;
    private final int page;
    private final int size;
    private final long totalItems;
}
