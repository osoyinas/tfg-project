package es.uah.pablopinas.tfg.auth_service.application.port.out;

import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import es.uah.pablopinas.tfg.auth_service.domain.model.User;

import java.util.Optional;

public interface LoadUserPort {
    /**
     * Loads a user by their email address.
     *
     * @param email the email address of the user
     * @return an Optional containing the User if found, or empty if not found
     */
    Optional<User> loadUserByEmail(String email);

    /**
     * Loads a user by their provider and provider ID.
     *
     * @param provider   the authentication provider (e.g., "google", "facebook")
     * @param providerId the unique identifier for the user in the specified provider
     * @return an Optional containing the User if found, or empty if not found
     */
    Optional<User> loadUserByProviderId(Provider provider, String providerId);
}
