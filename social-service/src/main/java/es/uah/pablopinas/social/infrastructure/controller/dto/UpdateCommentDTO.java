package es.uah.pablopinas.social.infrastructure.controller.dto;

import lombok.Data;

@Data
public class UpdateCommentDTO {
    private String userId;
    private String newText;
}

