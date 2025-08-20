package es.uah.pablopinas.social.infrastructure.controller.dto;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private String catalog_item_id;
    private Double rating;
    private String text;
    private boolean spoilers;
}
