package es.uah.pablopinas.social.infrastructure.adapter.event;

import es.uah.pablopinas.social.application.ports.out.ActivityPort;
import es.uah.pablopinas.social.domain.Activity;
import es.uah.pablopinas.social.domain.Review;
import es.uah.pablopinas.social.infrastructure.adapter.event.dto.RatingUpdatedEvent;
import org.springframework.stereotype.Service;

@Service
public class ActivityAdapter implements ActivityPort {

    ReviewsPublisher reviewsPublisher;

    public ActivityAdapter(ReviewsPublisher reviewsPublisher) {
        this.reviewsPublisher = reviewsPublisher;
    }

    @Override
    public void notifyActivity(Activity activity) {
        if (activity instanceof Review review) {
            reviewsPublisher.publish(new RatingUpdatedEvent(
                    review.getCatalogItemId(),
                    review.getRating() * 2   // Convert to 0-10 scale
            ));
        }
    }
}
