package es.uah.pablopinas.catalog.infrastructure.adapter.messaging.dto;

public record RatingUpdatedEvent(String catalogItemId, double newAverage) {
}

