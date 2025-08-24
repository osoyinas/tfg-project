package es.uah.pablopinas.social.infrastructure.adapter.event.dto;

public record RatingUpdatedEvent(String catalogItemId, double newAverage) {
}

