package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.application.ports.in.ReviewsUseCase;
import es.uah.pablopinas.social.application.ports.out.UserWithProfilesPort;
import es.uah.pablopinas.social.application.ports.out.UsersPort;
import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.domain.User;
import es.uah.pablopinas.social.domain.UserWithProfile;
import es.uah.pablopinas.social.infrastructure.controller.dto.ReviewRequestDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.ReviewResponseDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.UpdateReviewDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.UserWithProfileDTO;
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

    public ReviewsController(ReviewsUseCase reviewsUseCase, UserWithProfilesPort userPort) {
        this.reviewsUseCase = reviewsUseCase;
        this.userPort = userPort;
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
        return userWithProfile.map(withProfile -> ResponseEntity.ok(toResponseDTO(review, 0, withProfile))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponseDTO>> findReviews(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String itemId,
            @RequestParam(required = false) Boolean hasRating,
            @RequestParam(required = false) Boolean hasText,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Review> reviews = reviewsUseCase.findReviews(userId, itemId, hasRating, hasText, PageRequest.of(page, size));
        List<ReviewResponseDTO> dtos = reviews.stream().map(
                review -> {
                    int likesCount = reviewsUseCase.getReviewLikes(review.getId()).size();
                    Optional<UserWithProfile> user = userPort.getUser(review.getUserId());

                    return toResponseDTO(review, likesCount, user.orElse(null));
                }
        ).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getReview(@PathVariable String id) {
        Review review = reviewsUseCase.getReview(id);
        int likesCount = reviewsUseCase.getReviewLikes(id).size();
        Optional<UserWithProfile> user = userPort.getUser(review.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(review, likesCount, user.get()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable String id,
                                                          @RequestBody UpdateReviewDTO dto) {
        Review review = reviewsUseCase.updateReview(id, dto.getUserId(), dto.getNewRating(), dto.getNewText(), dto.getSpoilers());
        int likesCount = reviewsUseCase.getReviewLikes(id).size();
        Optional<UserWithProfile> user = userPort.getUser(dto.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(review, likesCount, user.get()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id,
                                             @RequestParam String userId) {
        reviewsUseCase.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeReview(@PathVariable String id,
                                           @RequestParam String userId) {
        reviewsUseCase.likeReview(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikeReview(@PathVariable String id,
                                             @RequestParam String userId) {
        reviewsUseCase.unlikeReview(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<List<UserWithProfileDTO>> getReviewLikes(@PathVariable String id) {
        List<UserWithProfile> users = reviewsUseCase.getReviewLikes(id);
        List<UserWithProfileDTO> dtos = users.stream().map(UserWithProfileDTO::toUserWithProfileDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private ReviewResponseDTO toResponseDTO(Review review, int likesCount, UserWithProfile user) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUserId());
        dto.setCatalogItemId(review.getCatalogItemId());
        dto.setRating(review.getRating());
        dto.setText(review.getText());
        dto.setSpoilers(review.isSpoilers());
        dto.setCreatedAt(review.getCreatedAt() != null ? review.getCreatedAt().toString() : null);
        dto.setLikesCount(likesCount);
        dto.setUser(UserWithProfileDTO.toUserWithProfileDTO(user));
        return dto;
    }

}
