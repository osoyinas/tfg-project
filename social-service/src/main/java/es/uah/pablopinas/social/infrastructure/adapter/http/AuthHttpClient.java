package es.uah.pablopinas.social.infrastructure.adapter.http;

import es.uah.pablopinas.social.infrastructure.adapter.http.keycloak.KeycloakHttpAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

public class AuthHttpClient {
    protected WebClient web;

    @Value("${keycloak.url}")
    protected String kcUrl;
    @Value("${keycloak.realm}")
    protected String realm;
    @Value("${keycloak.admin.client-id}")
    protected String clientId;
    @Value("${keycloak.admin.client-secret}")
    protected String clientSecret;

    protected AuthHttpClient(WebClient.Builder webBuilder) {
        this.web = webBuilder.build();
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

    /**
     * Sends a request to the Keycloak server with the specified HTTP method, URI, body, and response type.
     *
     * @param method       the HTTP method to use (e.g., GET, POST)
     * @param uri          the URI to send the request to
     * @param body         the body of the request (can be null)
     * @param responseType the class of the response type
     * @param <T>          the type of the response
     * @return a Mono containing the response of type T
     */
    protected <T> Mono<T> send(HttpMethod method, String uri, Object body, Class<T> responseType) {
        return adminToken().flatMap(token -> {
            WebClient.RequestBodySpec request = web.method(method)
                    .uri(uri)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .accept(MediaType.APPLICATION_JSON);
            if (body != null) {
                request = (WebClient.RequestBodySpec) request.contentType(MediaType.APPLICATION_JSON).bodyValue(body);
            }
            return request.retrieve().bodyToMono(responseType);
        });
    }

    /**
     * Sends a request to the Keycloak server with the specified HTTP method, URI, and response type.
     *
     * @param method       the HTTP method to use (e.g., GET, POST)
     * @param uri          the URI to send the request to
     * @param responseType the class of the response type
     * @param <T>          the type of the response
     * @return a Mono containing the response of type T
     */
    protected <T> Mono<T> send(HttpMethod method, String uri, Class<T> responseType) {
        return adminToken().flatMap(token -> {
            WebClient.RequestBodySpec request = web.method(method)
                    .uri(uri)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .accept(MediaType.APPLICATION_JSON);
            return request.retrieve().bodyToMono(responseType);
        });
    }

    record TokenResponse(String access_token) {
    }
}
