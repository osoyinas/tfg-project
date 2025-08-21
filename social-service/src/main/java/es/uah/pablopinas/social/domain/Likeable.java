package es.uah.pablopinas.social.domain;

import java.util.UUID;

public interface Likeable {
    String getId();

    LikeableType getType();
}
