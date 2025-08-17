package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Review;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewsPort {
    long countByUserId(UUID userId);

    boolean existsByUserIdAndCatalogItemId(UUID userId, UUID catalogItemId);

    Review save(Review review);

    List<Review> searchReviews(UUID userId, UUID itemId, String type, Boolean hasRating, Boolean hasText, PageRequest page);

    Optional<Review> findById(UUID reviewId);

    void delete(Review review);

    boolean existsById(UUID targetId);
}
