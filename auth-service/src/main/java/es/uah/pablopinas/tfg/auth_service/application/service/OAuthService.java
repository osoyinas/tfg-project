package es.uah.pablopinas.tfg.auth_service.application.service;

import es.uah.pablopinas.tfg.auth_service.application.port.in.OAuthAuthenticateUseCase;
import es.uah.pablopinas.tfg.auth_service.application.port.in.AuthTokens;
import es.uah.pablopinas.tfg.auth_service.application.port.out.LoadUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.SaveUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.OAuthPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.OAuthUserInfo;
import es.uah.pablopinas.tfg.auth_service.application.port.out.TokenPort;
import es.uah.pablopinas.tfg.auth_service.domain.exception.InvalidOAuthTokenException;
import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import es.uah.pablopinas.tfg.auth_service.domain.model.Role;
import es.uah.pablopinas.tfg.auth_service.domain.model.User;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

/**
 * Service that implements OAuth authentication use case.
 * Validates OAuth tokens with external providers, registers new users if needed,
 * and returns JWT tokens.
 */
@RequiredArgsConstructor
public class OAuthService implements OAuthAuthenticateUseCase {

    private final OAuthPort OAuthPort;
    private final LoadUserPort loadUserPort;
    private final SaveUserPort saveUserPort;
    private final TokenPort tokenPort;

    /**
     * Authenticates a user using OAuth token from an external provider.
     *
     * @param provider The OAuth provider name (e.g., "GOOGLE", "GITHUB").
     * @param token    OAuth access token provided by the client.
     * @return {@link AuthTokens} containing generated JWT tokens.
     * @throws InvalidOAuthTokenException if the OAuth token is invalid.
     */
    @Override
    public AuthTokens loginWithOAuth(Provider provider, String token) {
        boolean valid = OAuthPort.validateOAuthToken(provider, token);
        if (!valid) {
            throw new InvalidOAuthTokenException("Invalid OAuth token for provider: " + provider);
        }

        OAuthUserInfo userInfo = OAuthPort.getUserInfo(provider, token);

        // Try to find existing user by provider and providerId
        User user = loadUserPort.loadUserByProviderId(provider, userInfo.getProviderId())
                .orElseGet(() -> registerNewOAuthUser(provider, userInfo));

        return tokenPort.generateTokens(user);
    }

    /**
     * Registers a new user based on OAuth info.
     *
     * @param provider OAuth provider name.
     * @param userInfo Basic user info from OAuth provider.
     * @return Newly created {@link User}.
     */
    private User registerNewOAuthUser(Provider provider, OAuthUserInfo userInfo) {
        User newUser = User.builder()
                .id(UUID.randomUUID())
                .email(userInfo.getEmail())
                .provider(provider)
                .providerId(userInfo.getProviderId())
                .role(Role.USER)
                .build();

        return saveUserPort.saveUser(newUser);
    }
}
