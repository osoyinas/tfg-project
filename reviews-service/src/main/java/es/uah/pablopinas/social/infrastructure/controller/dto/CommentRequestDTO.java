package es.uah.pablopinas.social.infrastructure.controller.dto;

import lombok.Data;

@Data
public class CommentRequestDTO {
    private String userId;
    private String reviewId;
    private String text;
}

