package es.uah.pablopinas.tfg.auth_service.adapters.out.oauth;

import es.uah.pablopinas.tfg.auth_service.application.port.out.OAuthPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.OAuthUserInfo;
import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Adapter that delegates OAuth operations to the appropriate OAuth client implementation
 * depending on the provider (e.g., Google, GitHub).
 */
@Component
@RequiredArgsConstructor
public class OAuthClientAdapter implements OAuthPort {

    private final Map<String, OAuthPort> oauthClients;

    @Override
    public boolean validateOAuthToken(Provider provider, String token) {
        OAuthPort client = getClient(provider);
        return client.validateOAuthToken(provider, token);
    }

    @Override
    public OAuthUserInfo getUserInfo(Provider provider, String token) {
        OAuthPort client = getClient(provider);
        return client.getUserInfo(provider, token);
    }

    private OAuthPort getClient(Provider provider) {
        OAuthPort client = oauthClients.get(provider.name().toLowerCase());
        if (client == null) {
            throw new IllegalArgumentException("Unsupported OAuth provider: " + provider);
        }
        return client;
    }
}
