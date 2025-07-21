package es.uah.pablopinas.catalog.domain.exception;

public class InvalidCatalogItemException extends RuntimeException {
    public InvalidCatalogItemException(String message) {
        super(message);
    }
}
