package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FollowJpaRepository extends JpaRepository<Follow, String> {
    boolean existsByFollowerIdAndFolloweeId(String followerId, String followeeId);
    void deleteByFollowerIdAndFolloweeId(String followerId, String followeeId);
    long countByFolloweeId(String followeeId);
    long countByFollowerId(String followerId);
}

