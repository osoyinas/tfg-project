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
    private String commentId;
    @Column(nullable = false)
    private String userId;
    @Column(nullable = false)
    private String reviewId;
    private String text;
    private Instant createdAt;
    private Instant updatedAt;

    public Comment(String userId, String reviewId, String text) {
        this.commentId = UUID.randomUUID().toString();
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
    public String getId() {
        return commentId;
    }

    @Override
    public LikeableType getType() {
        return LikeableType.COMMENT;
    }
}
