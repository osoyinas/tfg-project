package es.uah.pablopinas.tfg.auth_service.application.port.out;

import es.uah.pablopinas.tfg.auth_service.application.port.in.AuthTokens;
import es.uah.pablopinas.tfg.auth_service.domain.model.User;

/**
 * Port for managing authentication tokens (access and refresh).
 * Implementations of this interface are responsible for generating, validating
 * and extracting user information from tokens.
 */
public interface TokenPort {

    /**
     * Generates a new pair of access and refresh tokens for the given user.
     *
     * @param user the authenticated user
     * @return an {@link AuthTokens} object containing access token, refresh token and expiration
     */
    AuthTokens generateTokens(User user);

    /**
     * Validates an access token.
     *
     * @param token the access token to validate
     * @return {@code true} if the token is valid, {@code false} otherwise
     */
    boolean validateAccessToken(String token);

    /**
     * Validates a refresh token.
     *
     * @param refreshToken the refresh token to validate
     * @return {@code true} if the token is valid, {@code false} otherwise
     */
    boolean validateRefreshToken(String refreshToken);

    /**
     * Extracts the user identifier from the given access token.
     *
     * @param token the access token
     * @return the user identifier as a {@link String}
     */
    String getUserIdFromAccessToken(String token);

    /**
     * Extracts the user identifier from the given refresh token.
     *
     * @param refreshToken the refresh token
     * @return the user identifier as a {@link String}
     */
    String getUserIdFromRefreshToken(String refreshToken);
}