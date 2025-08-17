package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.ReviewsPort;
import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.ReviewJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ReviewRepositoryAdapter implements ReviewsPort {
    private final ReviewJpaRepository reviewRepo;

    public ReviewRepositoryAdapter(ReviewJpaRepository reviewRepo) {
        this.reviewRepo = reviewRepo;
    }

    @Override
    public long countByUserId(UUID userId) {
        return reviewRepo.countByUserId(userId);
    }

    @Override
    public boolean existsByUserIdAndCatalogItemId(UUID userId, UUID catalogItemId) {
        return reviewRepo.existsByUserIdAndCatalogItemId(userId, catalogItemId);
    }

    @Override
    public Review save(Review review) {
        return reviewRepo.save(review);
    }

    @Override
    public List<Review> searchReviews(UUID userId, UUID itemId, String type, Boolean hasRating, Boolean hasText, PageRequest page) {
        // Implementar lógica de búsqueda avanzada si es necesario
        // Por ahora, solo por usuario o por item
        if (userId != null) return reviewRepo.findByUserId(userId, page);
        if (itemId != null) return reviewRepo.findByCatalogItemId(itemId, page);
        return List.of();
    }

    @Override
    public Optional<Review> findById(UUID reviewId) {
        return reviewRepo.findById(reviewId);
    }

    @Override
    public void delete(Review review) {
        reviewRepo.delete(review);
    }

    @Override
    public boolean existsById(UUID targetId) {
        return reviewRepo.existsById(targetId);
    }
}

