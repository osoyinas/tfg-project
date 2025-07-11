package es.uah.pablopinas.tfg.auth_service.application.port.out;

import lombok.Builder;
import lombok.Value;

/**
 * Data transfer object representing basic user information retrieved
 * from an external OAuth2 provider.
 * <p>
 * This object contains the unique identifier assigned by the provider
 * and the user's email address.
 */
@Value
@Builder
public class OAuthUserInfo {

    /**
     * The unique identifier of the user assigned by the OAuth provider.
     */
    String providerId;

    /**
     * The email address of the user as provided by the OAuth provider.
     */
    String email;
}

