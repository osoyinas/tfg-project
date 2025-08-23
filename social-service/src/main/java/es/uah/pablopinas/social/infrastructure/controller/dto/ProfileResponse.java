package es.uah.pablopinas.social.infrastructure.controller.dto;

import es.uah.pablopinas.social.domain.ProfileStats;
import es.uah.pablopinas.social.domain.UserWithProfile;
import lombok.Data;

@Data
public class ProfileResponse {
    UserWithProfile user;
    ProfileStats stats;
}
