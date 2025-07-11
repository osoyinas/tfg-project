package es.uah.pablopinas.tfg.auth_service.application.port.in;

public interface SessionUseCase {
    /**
     * Get the session duration in milliseconds for a given JWT token.
     *
     * @param jwtToken the JWT token for which to retrieve the session duration
     * @return the session duration in milliseconds
     */
    long getSessionDuration(String jwtToken);

    /**
     * Refresh the session using a refresh token.
     *
     * @param refreshToken the refresh token to use for refreshing the session
     * @return new AuthTokens containing access and refresh tokens
     */
    AuthTokens refreshSession(String refreshToken);
}
