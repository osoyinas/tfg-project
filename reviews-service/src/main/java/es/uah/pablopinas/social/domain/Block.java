package es.uah.pablopinas.social.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "blocks")
@Getter
@NoArgsConstructor
public class Block {
    @Id
    private UUID id;
    @Column(nullable = false)
    private UUID sourceUser;
    @Column(nullable = false)
    private UUID targetUser;
    private Instant since;

    public Block(UUID sourceUser, UUID targetUser) {
        this.id = UUID.randomUUID();
        this.sourceUser = sourceUser;
        this.targetUser = targetUser;
        this.since = Instant.now();
    }
}
