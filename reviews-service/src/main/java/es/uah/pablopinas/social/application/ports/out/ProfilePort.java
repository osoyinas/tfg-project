package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Profile;
import es.uah.pablopinas.social.domain.UserWithProfile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfilePort {
    Optional<Profile> findById(UUID userId);
    Profile save(Profile profile);

    List<Profile> findAllByIds(List<UUID> userIds);
}
