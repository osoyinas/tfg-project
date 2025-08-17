package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LikeJpaRepository extends JpaRepository<Like, UUID> {
    boolean existsByUserIdAndTargetId(UUID userId, UUID targetId);
    void deleteByUserIdAndTargetId(UUID userId, UUID targetId);
    List<Like> findAllByTargetId(UUID targetId);
    List<Like> findAllByUserId(UUID userId);
}

