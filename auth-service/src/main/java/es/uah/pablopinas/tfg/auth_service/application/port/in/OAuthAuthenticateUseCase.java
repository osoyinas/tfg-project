package es.uah.pablopinas.tfg.auth_service.application.port.in;

import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;

public interface OAuthAuthenticateUseCase {
    /**
     * Login with OAuth provider, returns JWT (or tokens).
     *
     * @param provider
     * @param oauthToken
     * @return
     */
    AuthTokens loginWithOAuth(Provider provider, String oauthToken);
}
