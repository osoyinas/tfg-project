package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Block;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BlockJpaRepository extends JpaRepository<Block, UUID> {
    boolean existsBySourceUserAndTargetUser(UUID sourceUser, UUID targetUser);
    void deleteBySourceUserAndTargetUser(UUID sourceUser, UUID targetUser);
}

