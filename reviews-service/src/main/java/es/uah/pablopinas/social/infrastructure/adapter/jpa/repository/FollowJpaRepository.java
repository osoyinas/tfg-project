package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FollowJpaRepository extends JpaRepository<Follow, UUID> {
    boolean existsByFollowerIdAndFolloweeId(UUID followerId, UUID followeeId);
    void deleteByFollowerIdAndFolloweeId(UUID followerId, UUID followeeId);
    long countByFolloweeId(UUID followeeId);
    long countByFollowerId(UUID followerId);
}

