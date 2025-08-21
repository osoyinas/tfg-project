package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.ProfilePort;
import es.uah.pablopinas.social.domain.Profile;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.ProfileJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProfileRepositoryAdapter implements ProfilePort {
    private final ProfileJpaRepository profileRepo;

    public ProfileRepositoryAdapter(ProfileJpaRepository profileRepo) {
        this.profileRepo = profileRepo;
    }

    @Override
    public Optional<Profile> findById(String userId) {
        return profileRepo.findById(userId);
    }

    @Override
    public Profile save(Profile profile) {
        return profileRepo.save(profile);
    }

    @Override
    public List<Profile> findAllByIds(List<String> userIds) {
        return profileRepo.findAllByUserIdIn(userIds);
    }
}

