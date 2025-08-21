package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Like;

import java.util.List;

public interface LikesPort {
    long countLikesReceivedByUser(String userId);

    boolean existsByUserIdAndTarget(String userId, String targetId);

    Like save(Like like);

    void deleteByUserIdAndTarget(String userId, String targetId);

    List<String> findAllUserIdsByTarget(String targetId);
}
