package es.uah.pablopinas.social.infrastructure.controller.dto;

import lombok.Data;

@Data
public class CommentResponseDTO {
    private String id;
    private UserWithProfileDTO user;
    private String reviewId;
    private String text;
    private String createdAt;
    private int likesCount;
    private boolean likedByCurrentUser;
}

