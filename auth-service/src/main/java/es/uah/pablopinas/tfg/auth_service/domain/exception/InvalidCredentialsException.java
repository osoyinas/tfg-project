package es.uah.pablopinas.tfg.auth_service.domain.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Invalid credentials");
    }
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
