package es.uah.pablopinas.catalog.domain;

public class InvalidCatalogTypeException extends RuntimeException {
    public InvalidCatalogTypeException(String message) {
        super(message);
    }
}
