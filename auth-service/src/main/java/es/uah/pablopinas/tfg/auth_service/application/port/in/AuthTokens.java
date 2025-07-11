package es.uah.pablopinas.tfg.auth_service.application.port.in;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthTokens {
    String accessToken;
    String refreshToken;
    long expiresIn; // Duration in milliseconds
}
