package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Follow;

import java.util.UUID;

public interface FollowPort {
    long countByFolloweeId(String userId);

    long countByFollowerId(String userId);

    boolean existsByFollowerIdAndFolloweeId(String currentUserId, String targetUserId);

    Follow save(Follow relation);

    void deleteByFollowerIdAndFolloweeId(String currentUserId, String targetUserId);
}
