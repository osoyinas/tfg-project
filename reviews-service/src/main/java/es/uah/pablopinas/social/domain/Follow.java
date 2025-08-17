package es.uah.pablopinas.social.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "follows")
public class Follow implements Activity{
    @Id
    private UUID id;   // ID UUID para la relación (opcional, podría usarse compuesta)
    @Column(nullable = false)
    private UUID followerId;
    @Column(nullable = false)
    private UUID followeeId;
    private Instant since;

    protected Follow() {
    }

    public Follow(UUID followerId, UUID followeeId) {
        this.id = UUID.randomUUID();
        this.followerId = followerId;
        this.followeeId = followeeId;
        this.since = Instant.now();
    }

}
