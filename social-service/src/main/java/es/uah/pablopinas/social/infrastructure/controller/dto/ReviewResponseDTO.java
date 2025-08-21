package es.uah.pablopinas.social.infrastructure.controller.dto;

import lombok.Data;

@Data
public class ReviewResponseDTO {
    private String id;
    private String userId;
    private String catalogItemId;
    private Double rating;
    private String text;
    private boolean spoilers;
    private String createdAt;
    private int likesCount;
    private UserWithProfileDTO user;
}

