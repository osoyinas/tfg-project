package es.uah.pablopinas.tfg.auth_service.adapters.out.persistence.repository;

import es.uah.pablopinas.tfg.auth_service.adapters.out.persistence.entity.UserEntity;
import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByProviderAndProviderId(Provider provider, String providerId);
}
