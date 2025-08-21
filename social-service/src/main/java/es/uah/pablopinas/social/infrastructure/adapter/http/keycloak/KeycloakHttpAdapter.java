package es.uah.pablopinas.social.infrastructure.adapter.http.keycloak;

import es.uah.pablopinas.social.application.ports.out.UsersPort;
import es.uah.pablopinas.social.domain.User;
import es.uah.pablopinas.social.infrastructure.adapter.http.AuthHttpClient;
import es.uah.pablopinas.social.infrastructure.adapter.http.keycloak.dto.KeycloakUserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class KeycloakHttpAdapter extends AuthHttpClient implements UsersPort {

    protected KeycloakHttpAdapter(WebClient.Builder webBuilder) {
        super(webBuilder);
    }

    @Override
    public Optional<User> findById(String userId) {
        if (userId == null) return Optional.empty();
        try {
            KeycloakUserDto dto = send(
                    HttpMethod.GET,
                    "%s/admin/realms/%s/users/%s".formatted(kcUrl, realm, userId),
                    KeycloakUserDto.class
            ).block();

            return dto != null ? Optional.of(toDomain(dto)) : Optional.empty();

        } catch (WebClientResponseException.NotFound e) {
            return Optional.empty();
        } catch (WebClientResponseException e) {
            log.warn("Keycloak GET user {} -> {} {}", userId, e.getStatusCode(), e.getResponseBodyAsString());
            return Optional.empty();
        } catch (Exception e) {
            log.warn("Keycloak GET user {} failed: {}", userId, e.toString());
            return Optional.empty();
        }
    }


    @Override
    public List<User> findAllByIds(List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) return List.of();
        int concurrency = 8; // ajustable
        return Flux.fromIterable(userIds)
                .flatMap(id -> send(
                                HttpMethod.GET,
                                "%s/admin/realms/%s/users/%s".formatted(kcUrl, realm, id),
                                KeycloakUserDto.class
                        )
                                .map(this::toDomain)
                                .onErrorResume(WebClientResponseException.NotFound.class, e -> Mono.empty())
                                .onErrorResume(ex -> {
                                    log.warn("Keycloak fetch failed for id {}: {}", id, ex.toString());
                                    return Mono.empty();
                                }),
                        concurrency)
                .collectList()
                .block();
    }

    private User toDomain(KeycloakUserDto kc) {
        User u = new User();
        u.setId(kc.id());
        u.setUsername(kc.username());
        u.setEmail(kc.email());
        u.setName(kc.firstName());
        u.setLastName(kc.lastName());
        return u;
    }
}
