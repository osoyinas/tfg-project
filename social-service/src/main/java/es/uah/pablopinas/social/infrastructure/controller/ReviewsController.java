package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.application.ports.in.CommentUseCase;
import es.uah.pablopinas.social.application.ports.in.ReviewsUseCase;
import es.uah.pablopinas.social.application.ports.out.LikesPort;
import es.uah.pablopinas.social.application.ports.out.UserWithProfilesPort;
import es.uah.pablopinas.social.application.ports.out.UsersPort;
import es.uah.pablopinas.social.domain.*;
import es.uah.pablopinas.social.infrastructure.controller.dto.*;
import es.uah.pablopinas.social.infrastructure.security.AuthUser;
import es.uah.pablopinas.social.infrastructure.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews")
public class ReviewsController {
    private final ReviewsUseCase reviewsUseCase;
    private final UserWithProfilesPort userPort;
    private final CommentUseCase commentUseCase;

    public ReviewsController(ReviewsUseCase reviewsUseCase, UserWithProfilesPort userPort, CommentUseCase commentUseCase) {
        this.reviewsUseCase = reviewsUseCase;
        this.userPort = userPort;
        this.commentUseCase = commentUseCase;
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @CurrentUser AuthUser user,
            @RequestBody ReviewRequestDTO dto) {
        Review review = reviewsUseCase.createReview(
                user.id(),
                dto.getCatalog_item_id(),
                dto.getRating(),
                dto.getText(),
                dto.isSpoilers()
        );
        Optional<UserWithProfile> userWithProfile = userPort.getUser(user.id());
        return userWithProfile.map(withProfile -> ResponseEntity.ok(toResponseDTO(review, 0, 0, withProfile, false))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> findReviews(
            @CurrentUser AuthUser user,
            @RequestParam(required = false) Boolean justMine,
            @RequestParam(required = false) String itemId,
            @RequestParam(required = false) Boolean hasRating,
            @RequestParam(required = false) Boolean hasText,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = justMine != null && justMine ? user.id() : null;
        List<Review> reviews = reviewsUseCase.findReviews(userId, itemId, hasRating, hasText, PageRequest.of(page, size));
        List<ReviewResponseDTO> dtos = reviews.stream().map(
                review -> {
                    List<UserWithProfile> likes = reviewsUseCase.getReviewLikes(review.getId());
                    int likesCount = likes.size();
                    Optional<UserWithProfile> userWithProfile = userPort.getUser(review.getUserId());
                    int commentsCount = commentUseCase.getCommentsCount(review.getId());
                    boolean likedByCurrentUser = likes.stream().anyMatch(u -> u.user().getId().equals(user.id()));
                    return toResponseDTO(review, likesCount, commentsCount, userWithProfile.orElse(null), likedByCurrentUser);
                }
        ).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReview(@PathVariable String id, @CurrentUser AuthUser user) {
        Review review = reviewsUseCase.getReview(id);
        List<UserWithProfile> likes = reviewsUseCase.getReviewLikes(id);
        int likesCount = likes.size();
        int commentsCount = commentUseCase.getCommentsCount(id);
        boolean likedByCurrentUser = likes.stream().anyMatch(u -> u.user().getId().equals(user.id()));
        Optional<UserWithProfile> userWithProfile = userPort.getUser(review.getUserId());
        if (userWithProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(review, likesCount, commentsCount, userWithProfile.get(), likedByCurrentUser));
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable String id,
//                                                          @RequestBody UpdateReviewDTO dto) {
//        Review review = reviewsUseCase.updateReview(id, dto.getUserId(), dto.getNewRating(), dto.getNewText(), dto.getSpoilers());
//        int likesCount = reviewsUseCase.getReviewLikes(id).size();
//        Optional<UserWithProfile> user = userPort.getUser(dto.getUserId());
//        if (user.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(toResponseDTO(review, likesCount, user.get()));
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id,
                                             @CurrentUser AuthUser user) {
        String userId = user.id();
        reviewsUseCase.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeReview(@PathVariable String id,
                                           @CurrentUser AuthUser user) {
        String userId = user.id();
        reviewsUseCase.likeReview(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikeReview(@PathVariable String id,
                                             @CurrentUser AuthUser user) {
        String userId = user.id();
        reviewsUseCase.unlikeReview(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<List<UserWithProfileDTO>> getReviewLikes(@PathVariable String id) {
        List<UserWithProfile> users = reviewsUseCase.getReviewLikes(id);
        List<UserWithProfileDTO> dtos = users.stream().map(UserWithProfileDTO::toUserWithProfileDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private ReviewResponseDTO toResponseDTO(Review review, int likesCount, int commentsCount, UserWithProfile user, boolean likedByCurrentUser) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUserId());
        dto.setCatalogItemId(review.getCatalogItemId());
        dto.setRating(review.getRating());
        dto.setText(review.getText());
        dto.setSpoilers(review.isSpoilers());
        dto.setCommentsCount(commentsCount);
        dto.setCreatedAt(review.getCreatedAt() != null ? review.getCreatedAt().toString() : null);
        dto.setLikesCount(likesCount);
        dto.setLikedByCurrentUser(likedByCurrentUser);
        dto.setUser(UserWithProfileDTO.toUserWithProfileDTO(user));
        return dto;
    }

}
