package es.uah.pablopinas.catalog.infrastructure.adapter.repository.model.details;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class BookDetailsDocument extends CatalogItemDetailsDocument {
    private String isbn;
    private String publisher;
    private Integer pageCount;
    private String language;
}
