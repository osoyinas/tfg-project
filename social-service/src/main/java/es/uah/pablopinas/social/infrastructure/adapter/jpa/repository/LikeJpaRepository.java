package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LikeJpaRepository extends JpaRepository<Like, String> {
    boolean existsByUserIdAndTargetId(String userId, String targetId);
    void deleteByUserIdAndTargetId(String userId, String targetId);
    List<Like> findAllByTargetId(String targetId);
    List<Like> findAllByUserId(String userId);
}

