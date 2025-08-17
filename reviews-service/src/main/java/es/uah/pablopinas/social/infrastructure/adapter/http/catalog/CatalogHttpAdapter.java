package es.uah.pablopinas.social.infrastructure.adapter.http.catalog;

import es.uah.pablopinas.social.application.ports.out.CatalogPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CatalogHttpAdapter implements CatalogPort {
    private final WebClient web;

    @Value("${keycloak.url}")
    String kcUrl;
    @Value("${keycloak.realm}")
    String realm;
    @Value("${keycloak.admin.client-id}")
    String clientId;
    @Value("${keycloak.admin.client-secret}")
    String clientSecret;
    @Value("${keycloak.users.default-max:50}")
    int defaultMax;

    @Override
    public boolean itemExists(UUID catalogItemId, String type) {

        return false;
    }

    private Mono<String> adminToken() {
        return web.post()
                .uri("%s/realms/%s/protocol/openid-connect/token".formatted(kcUrl, realm))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .map(TokenResponse::access_token);
    }

    record TokenResponse(String access_token) {
    }
}
