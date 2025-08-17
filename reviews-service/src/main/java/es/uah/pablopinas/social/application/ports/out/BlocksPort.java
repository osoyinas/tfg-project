package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Block;

import java.util.UUID;

public interface BlocksPort {
    boolean existsBySourceUserAndTargetUser(UUID targetUserId, UUID currentUserId);

    void deleteBySourceUserAndTargetUser(UUID currentUserId, UUID targetUserId);

    Block save(Block block);
}
