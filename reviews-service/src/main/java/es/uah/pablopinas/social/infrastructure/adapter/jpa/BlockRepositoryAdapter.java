package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.BlocksPort;
import es.uah.pablopinas.social.domain.Block;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.BlockJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class BlockRepositoryAdapter implements BlocksPort {
    private final BlockJpaRepository blockRepo;

    public BlockRepositoryAdapter(BlockJpaRepository blockRepo) {
        this.blockRepo = blockRepo;
    }

    @Override
    public boolean existsBySourceUserAndTargetUser(UUID targetUserId, UUID currentUserId) {
        return blockRepo.existsBySourceUserAndTargetUser(targetUserId, currentUserId);
    }

    @Override
    public void deleteBySourceUserAndTargetUser(UUID currentUserId, UUID targetUserId) {
        blockRepo.deleteBySourceUserAndTargetUser(currentUserId, targetUserId);
    }

    @Override
    public Block save(Block block) {
        return blockRepo.save(block);
    }
}

