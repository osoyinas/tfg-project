package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Block;

import java.util.UUID;

public interface BlocksPort {
    boolean existsBySourceUserAndTargetUser(String targetUserId, String currentUserId);

    void deleteBySourceUserAndTargetUser(String currentUserId, String targetUserId);

    Block save(Block block);
}
