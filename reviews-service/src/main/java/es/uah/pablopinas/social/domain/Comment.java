package es.uah.pablopinas.social.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor
public class Comment implements Activity, Likeable {
    @Id
    private UUID commentId;
    @Column(nullable = false)
    private UUID userId;        // autor del comentario
    @Column(nullable = false)
    private UUID reviewId;      // puede ser reviewId o activityId
    private String text;
    private Instant createdAt;
    private Instant updatedAt;

    public Comment(UUID userId, UUID reviewId, String text) {
        this.commentId = UUID.randomUUID();
        this.userId = userId;
        this.reviewId = reviewId;
        this.text = text;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void updateText(String text) {
        this.text = text;
        this.updatedAt = Instant.now();
    }


    @Override
    public UUID getId() {
        return commentId;
    }

    @Override
    public LikeableType getType() {
        return LikeableType.COMMENT;
    }
}
