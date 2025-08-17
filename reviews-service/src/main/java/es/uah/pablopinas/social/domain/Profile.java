package es.uah.pablopinas.social.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

// Perfil de usuario en la red social
@Entity
@Table(name = "profiles")
@Getter
public class Profile {
    @Id
    private UUID userId;
    private String bio;
    private String avatarUrl;

    protected Profile() {
    }

    public Profile(UUID userId) {
        this.userId = userId;
    }

    public void updateProfile(String newBio, String newAvatarUrl, Boolean privateFlag) {
        if (newBio != null) this.bio = newBio;
        if (newAvatarUrl != null) this.avatarUrl = newAvatarUrl;
    }

}
