package es.uah.pablopinas.social.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "follows")
public class Follow implements Activity {
    @Id
    private String id;   // ID String para la relación (opcional, podría usarse compuesta)
    @Column(nullable = false)
    private String followerId;
    @Column(nullable = false)
    private String followeeId;
    private Instant since;

    protected Follow() {
    }

    public Follow(String followerId, String followeeId) {
        this.id = UUID.randomUUID().toString();
        this.followerId = followerId;
        this.followeeId = followeeId;
        this.since = Instant.now();
    }

}
