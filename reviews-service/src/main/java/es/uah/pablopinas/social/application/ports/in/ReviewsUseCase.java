package es.uah.pablopinas.social.application.ports.in;

import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.domain.UserWithProfile;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.UUID;

public interface ReviewsUseCase {
    Review createReview(UUID userId, UUID catalogItemId, String type, Double rating, String text, boolean spoilers);
    List<Review> findReviews(UUID userId, UUID itemId, String type, Boolean hasRating, Boolean hasText, PageRequest page);
    Review getReview(UUID reviewId);
    Review updateReview(UUID reviewId, UUID userId, Double newRating, String newText, Boolean spoilers);
    void deleteReview(UUID reviewId, UUID userId);
    void likeReview(UUID reviewId, UUID userId);
    void unlikeReview(UUID reviewId, UUID userId);
    List<UserWithProfile> getReviewLikes(UUID reviewId);
}

