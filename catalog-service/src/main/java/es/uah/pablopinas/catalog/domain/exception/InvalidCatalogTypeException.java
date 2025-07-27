package es.uah.pablopinas.catalog.domain.exception;

public class InvalidCatalogTypeException extends RuntimeException {
    public InvalidCatalogTypeException(String message) {
        super(message);
    }
}
