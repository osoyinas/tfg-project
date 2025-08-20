package es.uah.pablopinas.social.infrastructure.controller.dto;

import es.uah.pablopinas.social.domain.UserWithProfile;
import lombok.Data;

@Data
public class UserWithProfileDTO {
    private String userId;
    private String username;
    private String profileImageUrl;

    public static UserWithProfileDTO toUserWithProfileDTO(UserWithProfile user) {
        UserWithProfileDTO dto = new UserWithProfileDTO();
        dto.setUserId(user.user().getId());
        dto.setUsername(user.user().getUsername());
        dto.setProfileImageUrl(user.profile().getAvatarUrl());
        return dto;
    }
}

