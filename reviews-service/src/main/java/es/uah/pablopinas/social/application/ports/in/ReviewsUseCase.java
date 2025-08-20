package es.uah.pablopinas.social.application.ports.in;

import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.domain.UserWithProfile;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ReviewsUseCase {
    Review createReview(String userId, String catalogItemId, Double rating, String text, boolean spoilers);

    List<Review> findReviews(String userId, String itemId, Boolean hasRating, Boolean hasText, PageRequest page);

    Review getReview(String reviewId);

    Review updateReview(String reviewId, String userId, Double newRating, String newText, Boolean spoilers);

    void deleteReview(String reviewId, String userId);

    void likeReview(String reviewId, String userId);

    void unlikeReview(String reviewId, String userId);

    List<UserWithProfile> getReviewLikes(String reviewId);
}

