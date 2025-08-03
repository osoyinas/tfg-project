package es.uah.pablopinas.catalog.infrastructure.exception;

import es.uah.pablopinas.catalog.infrastructure.adapter.exception.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;

/**
 * Manejador global de excepciones para toda la API.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationError(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String mensaje = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> {
                    String rejected = fieldError.getRejectedValue() != null ? fieldError.getRejectedValue().toString() : "valor vacío";
                    return String.format("El valor '%s' no es válido para el parámetro '%s'.", rejected, fieldError.getField());
                })
                .findFirst()
                .orElse("Parámetros inválidos.");

        return buildError(HttpStatus.BAD_REQUEST, "Error de validación", mensaje, request.getRequestURI());
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError> handleBindError(BindException ex, HttpServletRequest request) {
        String mensaje = ex.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    if (error instanceof FieldError fieldError) {
                        String rejected = fieldError.getRejectedValue() != null ? fieldError.getRejectedValue().toString() : "valor vacío";
                        return String.format("El valor '%s' no es válido para el parámetro '%s'.", rejected, fieldError.getField());
                    }
                    return error.getDefaultMessage();
                })
                .findFirst()
                .orElse("Error en los datos enviados.");

        return buildError(HttpStatus.BAD_REQUEST, "Error de datos", mensaje, request.getRequestURI());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        String mensaje = ex.getConstraintViolations().stream()
                .map(cv -> String.format("El valor '%s' no cumple la restricción: %s", cv.getInvalidValue(), cv.getMessage()))
                .findFirst()
                .orElse("Violación de restricciones.");

        return buildError(HttpStatus.BAD_REQUEST, "Restricción violada", mensaje, request.getRequestURI());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiError> handleMissingParams(MissingServletRequestParameterException ex, HttpServletRequest request) {
        String mensaje = "Falta el parámetro requerido: " + ex.getParameterName();
        return buildError(HttpStatus.BAD_REQUEST, "Parámetro requerido faltante", mensaje, request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String mensaje = String.format("El valor '%s' no es válido para el parámetro '%s'.",
                ex.getValue(), ex.getName());

        return buildError(HttpStatus.BAD_REQUEST, "Parámetro inválido", mensaje, request.getRequestURI());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        String mensaje = "Error al leer el cuerpo de la solicitud. Asegúrate de que el JSON sea válido.";
        return buildError(HttpStatus.BAD_REQUEST, "JSON mal formado", mensaje, request.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, "Argumento inválido", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex, HttpServletRequest request) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Error inesperado", ex.getMessage(), request.getRequestURI());
    }

    private ResponseEntity<ApiError> buildError(HttpStatus status, String error, String message, String path) {
        ApiError apiError = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(error)
                .message(message)
                .path(path)
                .build();
        return ResponseEntity.status(status).body(apiError);
    }
}
