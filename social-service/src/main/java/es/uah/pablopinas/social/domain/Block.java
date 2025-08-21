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
    private String id;
    @Column(nullable = false)
    private String sourceUser;
    @Column(nullable = false)
    private String targetUser;
    private Instant since;

    public Block(String sourceUser, String targetUser) {
        this.id = UUID.randomUUID().toString();
        this.sourceUser = sourceUser;
        this.targetUser = targetUser;
        this.since = Instant.now();
    }
}
