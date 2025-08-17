package es.uah.pablopinas.social.domain;

import java.util.UUID;

public interface Likeable {
    UUID getId();

    LikeableType getType();
}
