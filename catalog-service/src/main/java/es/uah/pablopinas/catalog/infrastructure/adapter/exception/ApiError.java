package es.uah.pablopinas.catalog.infrastructure.adapter.exception;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * Represents an API error response structure.
 * This class is used to standardize the error responses sent by the API.
 */
@Value
@Builder
public class ApiError {
    LocalDateTime timestamp;
    int status;
    String error;
    String message;
    String path;
}

