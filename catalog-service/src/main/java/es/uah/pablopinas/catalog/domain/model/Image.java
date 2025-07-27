package es.uah.pablopinas.catalog.domain.model;

import lombok.Builder;

@Builder
public record Image(String url, String altText) {
}
