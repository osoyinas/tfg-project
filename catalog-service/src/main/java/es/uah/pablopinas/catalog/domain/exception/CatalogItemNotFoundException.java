package es.uah.pablopinas.catalog.domain.exception;

public class CatalogItemNotFoundException extends RuntimeException {

    private static final String MESSAGE_TEMPLATE = "Catalog item with ID '%s' not found.";

    public CatalogItemNotFoundException(String catalogItemId) {
        super(String.format(MESSAGE_TEMPLATE, catalogItemId));
    }

    public CatalogItemNotFoundException(String catalogItemId, Throwable cause) {
        super(String.format(MESSAGE_TEMPLATE, catalogItemId), cause);
    }

}
