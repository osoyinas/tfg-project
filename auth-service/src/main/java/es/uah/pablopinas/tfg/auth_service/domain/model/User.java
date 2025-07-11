package es.uah.pablopinas.tfg.auth_service.domain.model;

import java.util.UUID;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class User {
    UUID id;
    String email;
    String passwordHash;
    Provider provider;
    String providerId;
    Role role;
}