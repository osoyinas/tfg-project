package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Review;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewJpaRepository extends JpaRepository<Review, UUID> {
    long countByUserId(UUID userId);
    boolean existsByUserIdAndCatalogItemId(UUID userId, UUID catalogItemId);
    List<Review> findByUserId(UUID userId, PageRequest page);
    List<Review> findByCatalogItemId(UUID catalogItemId, PageRequest page);
}

