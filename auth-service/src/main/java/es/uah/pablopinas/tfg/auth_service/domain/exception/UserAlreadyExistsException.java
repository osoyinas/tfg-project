package es.uah.pablopinas.tfg.auth_service.domain.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String email) {
        super("User already exists: " + email);
    }
}
