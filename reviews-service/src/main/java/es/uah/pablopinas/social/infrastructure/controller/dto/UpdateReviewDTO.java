package es.uah.pablopinas.social.infrastructure.controller.dto;

import lombok.Data;

@Data
public class UpdateReviewDTO {
    private String userId;
    private Double newRating;
    private String newText;
    private Boolean spoilers;
}

