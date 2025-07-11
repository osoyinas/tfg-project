package es.uah.pablopinas.tfg.auth_service.application.port.in;

public interface AuthenticationUseCase {
    /**
     * Login with email and password, returns JWT (or tokens).
     *
     * @param email
     * @param password
     * @return AuthTokens containing access token, refresh token, and expiration time.
     */
    AuthTokens loginWithEmailAndPassword(String email, String password);
}
