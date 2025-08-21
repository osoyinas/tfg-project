package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProfileJpaRepository extends JpaRepository<Profile, String> {
    List<Profile> findAllByUserIdIn(List<String> userIds);
}

