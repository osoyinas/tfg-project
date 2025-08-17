package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Activity;
import es.uah.pablopinas.social.domain.Comment;
import es.uah.pablopinas.social.domain.Review;

import java.util.Optional;
import java.util.UUID;

public interface ActivityPort {

    void notifyActivity(Activity activity);
}
