package es.uah.pablopinas.catalog.infrastructure.adapter.controller;

import es.uah.pablopinas.catalog.domain.exception.InvalidCatalogTypeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCatalogTypeException.class)
    public ResponseEntity<Object> handleInvalidCatalogType(InvalidCatalogTypeException ex) {
        return ResponseEntity.badRequest().body(createError("INVALID_CATALOG_TYPE", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(createError("BAD_REQUEST", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("INTERNAL_ERROR", ex.getMessage()));
    }

    private Map<String, Object> createError(String code, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", code);
        error.put("message", message);
        return error;
    }
    
}
