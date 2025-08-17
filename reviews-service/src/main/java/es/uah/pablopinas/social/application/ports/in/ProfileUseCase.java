package es.uah.pablopinas.social.application.ports.in;

import es.uah.pablopinas.social.domain.Profile;
import es.uah.pablopinas.social.domain.ProfileStats;

import java.util.UUID;

public interface ProfileUseCase {
    Profile getPublicProfile(UUID userId, UUID requestingUserId);
    Profile updateProfile(UUID userId, String bio, String avatarUrl, Boolean privateFlag);
    ProfileStats getProfileStats(UUID userId);
    void followUser(UUID currentUserId, UUID targetUserId);
    void unfollowUser(UUID currentUserId, UUID targetUserId);
    void blockUser(UUID currentUserId, UUID targetUserId);
    void unblockUser(UUID currentUserId, UUID targetUserId);
}

