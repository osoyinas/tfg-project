package es.uah.pablopinas.catalog.domain.exception;

public class CatalogItemNotFoundException extends RuntimeException {
    public CatalogItemNotFoundException(String id) {
        super("Catalog item not found with id: " + id);
    }
}