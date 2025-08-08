package es.uah.pablopinas.catalog.infrastructure.adapter.messaging.in;

import es.uah.pablopinas.catalog.application.port.in.RateCatalogItemUseCase;
import es.uah.pablopinas.catalog.infrastructure.adapter.messaging.dto.RatingUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RatingUpdatedListener {

    private final RateCatalogItemUseCase rateService;

    @RabbitListener(queues = "rating.updated")
    public void handle(RatingUpdatedEvent event) {
        rateService.rateCatalogItem(event.catalogItemId(), event.newAverage());
    }
}
