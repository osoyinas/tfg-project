package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.FollowPort;
import es.uah.pablopinas.social.domain.Follow;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.FollowJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class FollowRepositoryAdapter implements FollowPort {
    private final FollowJpaRepository followRepo;

    public FollowRepositoryAdapter(FollowJpaRepository followRepo) {
        this.followRepo = followRepo;
    }

    @Override
    public boolean existsByFollowerIdAndFolloweeId(UUID followerId, UUID followeeId) {
        return followRepo.existsByFollowerIdAndFolloweeId(followerId, followeeId);
    }

    @Override
    public void deleteByFollowerIdAndFolloweeId(UUID followerId, UUID followeeId) {
        followRepo.deleteByFollowerIdAndFolloweeId(followerId, followeeId);
    }

    @Override
    public long countByFolloweeId(UUID followeeId) {
        return followRepo.countByFolloweeId(followeeId);
    }

    @Override
    public long countByFollowerId(UUID followerId) {
        return followRepo.countByFollowerId(followerId);
    }

    @Override
    public Follow save(Follow follow) {
        return followRepo.save(follow);
    }
}

