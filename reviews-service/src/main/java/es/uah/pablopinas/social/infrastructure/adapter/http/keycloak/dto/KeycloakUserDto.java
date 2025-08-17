package es.uah.pablopinas.social.infrastructure.adapter.http.keycloak.dto;

public record KeycloakUserDto(
        String id,
        String username,
        String email,
        String firstName,
        String lastName
) {
}
