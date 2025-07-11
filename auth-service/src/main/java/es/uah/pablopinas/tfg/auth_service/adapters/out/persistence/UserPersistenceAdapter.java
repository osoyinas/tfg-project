package es.uah.pablopinas.tfg.auth_service.adapters.out.persistence;

import es.uah.pablopinas.tfg.auth_service.application.port.out.LoadUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.SaveUserPort;
import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import es.uah.pablopinas.tfg.auth_service.domain.model.Role;
import es.uah.pablopinas.tfg.auth_service.domain.model.User;
import es.uah.pablopinas.tfg.auth_service.adapters.out.persistence.entity.UserEntity;
import es.uah.pablopinas.tfg.auth_service.adapters.out.persistence.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Adapter implementing LoadUserPort and SaveUserPort using JPA.
 */
@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements LoadUserPort, SaveUserPort {

    private final UserJpaRepository userJpaRepository;

    @Override
    public Optional<User> loadUserByEmail(String email) {
        return userJpaRepository.findByEmail(email)
                .map(this::mapToDomain);
    }

    @Override
    public Optional<User> loadUserByProviderId(Provider provider, String providerId) {
        return userJpaRepository.findByProviderAndProviderId(provider, providerId)
                .map(this::mapToDomain);
    }

    @Override
    public User saveUser(User user) {
        UserEntity entity = mapToEntity(user);
        UserEntity saved = userJpaRepository.save(entity);
        return mapToDomain(saved);
    }

    // Helper method to convert UserEntity to User (domain model)
    private User mapToDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .provider(Provider.valueOf(entity.getProvider().name()))
                .providerId(entity.getProviderId())
                .role(Role.valueOf(entity.getRole().name()))
                .build();
    }

    // Helper method to convert User (domain model) to UserEntity
    private UserEntity mapToEntity(User user) {
        UserEntity entity = new UserEntity();
        entity.setId(user.getId() != null ? user.getId() : UUID.randomUUID());
        entity.setEmail(user.getEmail());
        entity.setPasswordHash(user.getPasswordHash());
        entity.setProvider(user.getProvider());
        entity.setProviderId(user.getProviderId());
        entity.setRole(user.getRole());
        return entity;
    }
}
