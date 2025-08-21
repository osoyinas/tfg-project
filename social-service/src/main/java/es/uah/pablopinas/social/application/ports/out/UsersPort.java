package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsersPort {
    Optional<User> findById(String userId);
    List<User> findAllByIds(List<String> userIds);
}
