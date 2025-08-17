package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Like;

import java.util.List;
import java.util.UUID;

public interface LikesPort {
    long countLikesReceivedByUser(UUID userId);

    boolean existsByUserIdAndTarget(UUID userId, UUID targetId);

    Like save(Like like);

    void deleteByUserIdAndTarget(UUID userId, UUID targetId);

    List<UUID> findAllUserIdsByTarget(UUID targetId);
}
