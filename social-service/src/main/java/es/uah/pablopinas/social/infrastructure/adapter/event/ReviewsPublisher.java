package es.uah.pablopinas.social.infrastructure.adapter.event;

import es.uah.pablopinas.social.infrastructure.adapter.event.dto.RatingUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ReviewsPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publish(RatingUpdatedEvent event) {
        rabbitTemplate.convertAndSend("rating.updated", event);
    }
}
