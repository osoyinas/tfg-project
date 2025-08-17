package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.LikesPort;
import es.uah.pablopinas.social.domain.Like;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.LikeJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class LikeRepositoryAdapter implements LikesPort {
    private final LikeJpaRepository likeRepo;

    public LikeRepositoryAdapter(LikeJpaRepository likeRepo) {
        this.likeRepo = likeRepo;
    }

    @Override
    public boolean existsByUserIdAndTarget(UUID userId, UUID targetId) {
        return likeRepo.existsByUserIdAndTargetId(userId, targetId);
    }

    @Override
    public Like save(Like like) {
        return likeRepo.save(like);
    }

    @Override
    public void deleteByUserIdAndTarget(UUID userId, UUID targetId) {
        likeRepo.deleteByUserIdAndTargetId(userId, targetId);
    }

    @Override
    public List<UUID> findAllUserIdsByTarget(UUID targetId) {
        return likeRepo.findAllByTargetId(targetId).stream().map(Like::getUserId).toList();
    }

    @Override
    public long countLikesReceivedByUser(UUID userId) {
        return likeRepo.findAllByUserId(userId).size();
    }
}

