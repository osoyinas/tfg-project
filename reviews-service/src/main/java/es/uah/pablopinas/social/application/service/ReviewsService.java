package es.uah.pablopinas.social.application.service;

import es.uah.pablopinas.social.application.ports.in.ReviewsUseCase;
import es.uah.pablopinas.social.application.ports.out.*;
import es.uah.pablopinas.social.domain.Like;
import es.uah.pablopinas.social.domain.LikeableType;
import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.domain.UserWithProfile;
import es.uah.pablopinas.social.domain.exceptions.DuplicateException;
import es.uah.pablopinas.social.domain.exceptions.ForbiddenException;
import es.uah.pablopinas.social.domain.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewsService implements ReviewsUseCase {
    
    private final ReviewsPort reviewRepo;
    private final LikesPort likeRepo;
    private final ActivityPort activityService;
    private final CatalogPort catalogPort;
    private final UserWithProfilesPort usersPort;

    public Review createReview(UUID userId, UUID catalogItemId, String type,
                               Double rating, String text, boolean spoilers) {
        // (Regla: un usuario, una reseña por item)
        if (reviewRepo.existsByUserIdAndCatalogItemId(userId, catalogItemId)) {
            throw new DuplicateException("Review already exists for this item by the user");
        }
        // Verificar con catalog-api que el item exista y esté activo:
        if (!catalogPort.itemExists(catalogItemId, type)) {
            throw new IllegalArgumentException("Item does not exist");
        }
        Review review = new Review(userId, catalogItemId, rating, text, spoilers);
        Review saved = reviewRepo.save(review);
        activityService.notifyActivity(review);
        return saved;
    }

    public List<Review> findReviews(UUID userId, UUID itemId, String type,
                                    Boolean hasRating, Boolean hasText, PageRequest page) {
        // Construir criterios dinámicamente (omitiendo pseudocódigo de query)
        return reviewRepo.searchReviews(userId, itemId, type, hasRating, hasText, page);
    }

    public Review getReview(UUID reviewId) {
        return reviewRepo.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Review not found"));
    }

    public Review updateReview(UUID reviewId, UUID userId, Double newRating, String newText, Boolean spoilers) {
        Review review = getReview(reviewId);
        if (!review.getUserId().equals(userId)) {
            throw new ForbiddenException("Cannot edit someone else's review");
        }
        review.updateReview(newRating, newText, spoilers);
        return reviewRepo.save(review);
    }

    public void deleteReview(UUID reviewId, UUID userId) {
        Review review = getReview(reviewId);
        if (!review.getUserId().equals(userId)) {
            throw new ForbiddenException("Cannot delete someone else's review");
        }
        reviewRepo.delete(review);
        // Optionally, remove related likes and comments (or cascade if configured).
    }

    public void likeReview(UUID reviewId, UUID userId) {
        // Check if already liked
        if (likeRepo.existsByUserIdAndTarget(userId, reviewId)) return;
        Like like = likeRepo.save(new Like(userId, reviewId, LikeableType.REVIEW));
        activityService.notifyActivity(like);
    }

    public void unlikeReview(UUID reviewId, UUID userId) {
        likeRepo.deleteByUserIdAndTarget(userId, reviewId);
    }

    public List<UserWithProfile> getReviewLikes(UUID reviewId) {
        List<UUID> userIds = likeRepo.findAllUserIdsByTarget(reviewId);
        return usersPort.getUsersByIds(userIds);
    }
}
