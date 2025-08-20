package es.uah.pablopinas.social.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Getter
@NoArgsConstructor
public class Review implements Activity, Likeable {
    @Id
    private String reviewId;
    @Column(nullable = false)
    private String userId;
    @Column(nullable = false)
    private String catalogItemId;
    private Double rating;
    private String text;
    private boolean spoilers;
    private Instant createdAt;
    private Instant updatedAt;

    public Review(String userId, String catalogItemId,
                  Double rating, String text, boolean spoilers) {
        this.reviewId = UUID.randomUUID().toString();
        this.userId = userId;
        this.catalogItemId = catalogItemId;

        this.rating = rating;
        this.text = text;
        this.spoilers = spoilers;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void updateReview(Double newRating, String newText, Boolean spoilersFlag) {
        if (newRating != null) {
            if (newRating < 0 || newRating > 10) throw new IllegalArgumentException("Rating out of range");
            this.rating = newRating;
        }
        if (newText != null) {
            this.text = newText;
        }
        if (spoilersFlag != null) {
            this.spoilers = spoilersFlag;
        }
        this.updatedAt = Instant.now();
    }

    @Override
    public String getId() {
        return reviewId;
    }

    @Override
    public LikeableType getType() {
        return LikeableType.REVIEW;
    }

}
