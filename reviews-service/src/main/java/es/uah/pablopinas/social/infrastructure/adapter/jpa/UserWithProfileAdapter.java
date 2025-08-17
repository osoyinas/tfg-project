package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.ProfilePort;
import es.uah.pablopinas.social.application.ports.out.UserWithProfilesPort;
import es.uah.pablopinas.social.application.ports.out.UsersPort;
import es.uah.pablopinas.social.domain.Profile;
import es.uah.pablopinas.social.domain.User;
import es.uah.pablopinas.social.domain.UserWithProfile;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserWithProfileAdapter implements UserWithProfilesPort {

    UsersPort usersPort;
    ProfilePort profilePort;

    @Override
    public Optional<UserWithProfile> getUser(UUID id) {
        Optional<User> user = usersPort.findById(id);
        if (user.isEmpty()) return Optional.empty();

        Optional<Profile> profileOpt = profilePort.findById(id);
        Profile profile;
        if (profileOpt.isEmpty()) {
            profile = new Profile(id);
            profilePort.save(profile);
        } else {
            profile = profileOpt.get();
        }
        UserWithProfile userWithProfile = new UserWithProfile(user.get(), profile);
        return Optional.of(userWithProfile);
    }

    @Override
    public List<UserWithProfile> getUsersByIds(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) return List.of();

        // IDs únicos y no nulos
        List<UUID> uniqueIds = ids.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        // 1) Fetch de usuarios existentes
        List<User> users = usersPort.findAllByIds(uniqueIds);
        if (users.isEmpty()) return List.of();

        // 2) Fetch de perfiles existentes
        List<Profile> existingProfiles = profilePort.findAllByIds(uniqueIds);
        Map<UUID, Profile> profilesById = existingProfiles.stream()
                .collect(Collectors.toMap(Profile::getUserId, p -> p, (a, b) -> a));

        // 3) Para cada usuario, asegurar perfil (crear si no existe) y componer resultado
        List<UserWithProfile> result = new ArrayList<>(users.size());
        for (User u : users) {
            UUID uid = u.getId();
            Profile profile = profilesById.get(uid);
            if (profile == null) {
                profile = new Profile(uid);
                profilePort.save(profile);
                profilesById.put(uid, profile);
            }
            result.add(new UserWithProfile(u, profile));
        }
        return result;
    }
}
