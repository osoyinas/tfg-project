package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.UserWithProfile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserWithProfilesPort {
    Optional<UserWithProfile> getUser(UUID id);

    List<UserWithProfile> getUsersByIds(List<UUID> ids);
}
