package es.uah.pablopinas.tfg.auth_service.adapters.out.oauth;

import es.uah.pablopinas.tfg.auth_service.application.port.out.OAuthPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.OAuthUserInfo;
import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * OAuth client implementation for GitHub.
 */
@Component("github")
@Slf4j
public class GithubOAuthClient implements OAuthPort {

    private final WebClient webClient = WebClient.create();

    @Value("${oauth.github.userinfo-uri}")
    private String userInfoUri;

    @Value("${oauth.github.client-id}")
    private String clientId;

    @Value("${oauth.github.client-secret}")
    private String clientSecret;

    @Override
    public boolean validateOAuthToken(Provider provider, String token) {
        if (!Provider.GITHUB.equals(provider)) {
            throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
        try {
            OAuthUserInfo userInfo = getUserInfo(provider, token);
            return userInfo != null && userInfo.getProviderId() != null;
        } catch (Exception e) {
            log.warn("GitHub token validation failed", e);
            return false;
        }
    }

    @Override
    public OAuthUserInfo getUserInfo(Provider provider, String token) {
        if (!Provider.GITHUB.equals(provider)) {
            throw new IllegalArgumentException("Unsupported provider: " + provider);
        }

        Mono<Map> responseMono = webClient.get()
                .uri(userInfoUri)
                .header(HttpHeaders.AUTHORIZATION, "token " + token)
                .retrieve()
                .bodyToMono(Map.class);

        Map userInfoMap = responseMono.block();

        if (userInfoMap == null || userInfoMap.get("id") == null) {
            throw new RuntimeException("Invalid GitHub OAuth token");
        }

        String email = (String) userInfoMap.get("email");
        if (email == null) {
            email = ""; // GitHub puede no enviar email si está privado
        }

        return OAuthUserInfo.builder()
                .email(email)
                .providerId(String.valueOf(userInfoMap.get("id")))
                .build();
    }
}
