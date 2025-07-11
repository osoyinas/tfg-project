package es.uah.pablopinas.tfg.auth_service.application.port.out;

import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;

/**
 * Port for interacting with external OAuth2 providers such as Google or GitHub.
 * Implementations of this interface are responsible for validating OAuth tokens
 * and retrieving user information from the provider.
 */
public interface OAuthPort {

    /**
     * Validates the given OAuth access token with the specified provider.
     *
     * @param provider the OAuth provider name (e.g., "GOOGLE", "GITHUB")
     * @param token    the OAuth access token issued by the provider
     * @return {@code true} if the token is valid, {@code false} otherwise
     */
    boolean validateOAuthToken(Provider provider, String token);

    /**
     * Retrieves basic user information from the provider using the given token.
     *
     * @param provider the OAuth provider name (e.g., "GOOGLE", "GITHUB")
     * @param token    the OAuth access token issued by the provider
     * @return an {@link OAuthUserInfo} object containing the user's provider ID and email
     */
    OAuthUserInfo getUserInfo(Provider provider, String token);
}

