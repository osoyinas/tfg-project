package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.LikesPort;
import es.uah.pablopinas.social.domain.Like;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.LikeJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LikeRepositoryAdapter implements LikesPort {
    private final LikeJpaRepository likeRepo;

    public LikeRepositoryAdapter(LikeJpaRepository likeRepo) {
        this.likeRepo = likeRepo;
    }

    @Override
    public boolean existsByUserIdAndTarget(String userId, String targetId) {
        return likeRepo.existsByUserIdAndTargetId(userId, targetId);
    }

    @Override
    public Like save(Like like) {
        return likeRepo.save(like);
    }

    @Override
    public void deleteByUserIdAndTarget(String userId, String targetId) {
        likeRepo.deleteByUserIdAndTargetId(userId, targetId);
    }

    @Override
    public List<String> findAllUserIdsByTarget(String targetId) {
        return likeRepo.findAllByTargetId(targetId).stream().map(Like::getUserId).toList();
    }

    @Override
    public long countLikesReceivedByUser(String userId) {
        return likeRepo.findAllByUserId(userId).size();
    }
}

