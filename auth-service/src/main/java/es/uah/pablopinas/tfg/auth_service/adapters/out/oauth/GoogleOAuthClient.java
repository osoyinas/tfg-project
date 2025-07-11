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

/**
 * OAuth client implementation for Google.
 */
@Component("google")
@Slf4j
public class GoogleOAuthClient implements OAuthPort {

    private final WebClient webClient = WebClient.create();

    @Value("${oauth.google.userinfo-uri}")
    private String userInfoUri;

    @Override
    public boolean validateOAuthToken(Provider provider, String token) {
        if (!Provider.GOOGLE.equals(provider)) {
            throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
        try {
            OAuthUserInfo userInfo = getUserInfo(provider, token);
            return userInfo != null && userInfo.getEmail() != null;
        } catch (Exception e) {
            log.warn("Google token validation failed", e);
            return false;
        }
    }

    @Override
    public OAuthUserInfo getUserInfo(Provider provider, String token) {
        if (!Provider.GOOGLE.equals(provider)) {
            throw new IllegalArgumentException("Unsupported provider: " + provider);
        }

        Mono<GoogleUserInfoResponse> responseMono = webClient.get()
                .uri(userInfoUri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(GoogleUserInfoResponse.class);

        GoogleUserInfoResponse response = responseMono.block();

        if (response == null || response.getEmail() == null) {
            throw new RuntimeException("Invalid Google OAuth token");
        }

        return OAuthUserInfo.builder()
                .email(response.getEmail())
                .providerId(response.getSub())
                .build();
    }

    // Clase interna para parsear JSON de Google userinfo
    private static class GoogleUserInfoResponse {
        private String sub;
        private String email;

        public String getSub() {
            return sub;
        }

        public void setSub(String sub) {
            this.sub = sub;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
