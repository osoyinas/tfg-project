package es.uah.pablopinas.social.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "likes")
@Getter
@NoArgsConstructor
public class Like implements Activity {
    @Id
    private UUID id;
    @Column(nullable = false)
    private UUID userId;
    @Column(nullable = false)
    private UUID targetId;
    @Enumerated(EnumType.STRING)
    private LikeableType type;
    private Instant likedAt;


    public Like(UUID userId, Likeable target) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.targetId = target.getId();
        this.type = target.getType();
        this.likedAt = Instant.now();
    }

    public Like(UUID userId, UUID targetId, LikeableType type) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.targetId = targetId;
        this.type = type;
        this.likedAt = Instant.now();
    }
}
