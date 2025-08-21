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
    public boolean existsBySourceUserAndTargetUser(String targetUserId, String currentUserId) {
        return blockRepo.existsBySourceUserAndTargetUser(targetUserId, currentUserId);
    }

    @Override
    public void deleteBySourceUserAndTargetUser(String currentUserId, String targetUserId) {
        blockRepo.deleteBySourceUserAndTargetUser(currentUserId, targetUserId);
    }

    @Override
    public Block save(Block block) {
        return blockRepo.save(block);
    }
}

