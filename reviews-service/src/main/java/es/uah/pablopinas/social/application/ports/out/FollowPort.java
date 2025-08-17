package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Follow;

import java.util.UUID;

public interface FollowPort {
    long countByFolloweeId(UUID userId);

    long countByFollowerId(UUID userId);

    boolean existsByFollowerIdAndFolloweeId(UUID currentUserId, UUID targetUserId);

    Follow save(Follow relation);

    void deleteByFollowerIdAndFolloweeId(UUID currentUserId, UUID targetUserId);
}
