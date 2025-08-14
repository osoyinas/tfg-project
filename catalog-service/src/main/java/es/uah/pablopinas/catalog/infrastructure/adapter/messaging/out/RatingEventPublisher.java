package es.uah.pablopinas.catalog.infrastructure.adapter.messaging.out;

import es.uah.pablopinas.catalog.infrastructure.adapter.messaging.dto.RatingUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class RatingEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publish(RatingUpdatedEvent event) {
        rabbitTemplate.convertAndSend("rating.updated", event);
    }
}
