package es.uah.pablopinas.catalog.domain.model.details;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookDetails implements CatalogItemDetails {
    String isbn;
    String publisher;
    Integer pageCount;
}
