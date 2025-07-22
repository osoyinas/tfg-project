package es.uah.pablopinas.catalog.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Image {
    String url;
    String altText;
}
