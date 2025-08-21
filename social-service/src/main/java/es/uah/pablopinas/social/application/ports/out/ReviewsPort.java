package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Review;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewsPort {
    long countByUserId(String userId);

    boolean existsByUserIdAndCatalogItemId(String userId, String catalogItemId);

    Review save(Review review);

    List<Review> searchReviews(String userId, String itemId, Boolean hasRating, Boolean hasText, PageRequest page);

    Optional<Review> findById(String reviewId);

    void delete(Review review);

    boolean existsById(String targetId);
}
