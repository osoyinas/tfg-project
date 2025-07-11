package es.uah.pablopinas.tfg.auth_service.domain.exception;

public class InvalidOAuthTokenException extends RuntimeException {
    public InvalidOAuthTokenException(String message) {
        super(message);
    }
    public InvalidOAuthTokenException(String message, Throwable cause) {
        super(message, cause);
    }
    public InvalidOAuthTokenException() {
        super("Invalid OAuth token");
    }
}
