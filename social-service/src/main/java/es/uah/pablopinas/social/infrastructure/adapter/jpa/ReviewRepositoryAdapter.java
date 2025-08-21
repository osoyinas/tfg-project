package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.ReviewsPort;
import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.ReviewJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ReviewRepositoryAdapter implements ReviewsPort {
    private final ReviewJpaRepository reviewRepo;

    public ReviewRepositoryAdapter(ReviewJpaRepository reviewRepo) {
        this.reviewRepo = reviewRepo;
    }

    @Override
    public long countByUserId(String userId) {
        return reviewRepo.countByUserId(userId);
    }

    @Override
    public boolean existsByUserIdAndCatalogItemId(String userId, String catalogItemId) {
        return reviewRepo.existsByUserIdAndCatalogItemId(userId, catalogItemId);
    }

    @Override
    public Review save(Review review) {
        return reviewRepo.save(review);
    }

    @Override
    public List<Review> searchReviews(String userId, String itemId, Boolean hasRating, Boolean hasText, PageRequest page) {
        // Búsqueda avanzada combinando filtros
        if (userId != null && itemId != null) {
            if (Boolean.TRUE.equals(hasRating)) {
                return reviewRepo.findByUserIdAndCatalogItemIdAndRatingIsNotNull(userId, itemId, page);
            }
            if (Boolean.TRUE.equals(hasText)) {
                return reviewRepo.findByUserIdAndCatalogItemIdAndTextIsNotNull(userId, itemId, page);
            }
            return reviewRepo.findByUserIdAndCatalogItemId(userId, itemId, page);
        }
        if (userId != null) {
            if (Boolean.TRUE.equals(hasRating)) {
                return reviewRepo.findByUserIdAndRatingIsNotNull(userId, page);
            }
            if (Boolean.TRUE.equals(hasText)) {
                return reviewRepo.findByUserIdAndTextIsNotNull(userId, page);
            }
            return reviewRepo.findByUserId(userId, page);
        }
        if (itemId != null) {
            if (Boolean.TRUE.equals(hasRating)) {
                return reviewRepo.findByCatalogItemIdAndRatingIsNotNull(itemId, page);
            }
            if (Boolean.TRUE.equals(hasText)) {
                return reviewRepo.findByCatalogItemIdAndTextIsNotNull(itemId, page);
            }
            return reviewRepo.findByCatalogItemId(itemId, page);
        }
        // Si no hay filtros, devolver lista vacía
        return List.of();
    }

    @Override
    public Optional<Review> findById(String reviewId) {
        return reviewRepo.findById(reviewId);
    }

    @Override
    public void delete(Review review) {
        reviewRepo.delete(review);
    }

    @Override
    public boolean existsById(String targetId) {
        return reviewRepo.existsById(targetId);
    }
}
