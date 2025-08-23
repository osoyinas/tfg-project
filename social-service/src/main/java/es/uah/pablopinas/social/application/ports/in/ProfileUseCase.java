package es.uah.pablopinas.social.application.ports.in;

import es.uah.pablopinas.social.domain.Profile;
import es.uah.pablopinas.social.domain.ProfileStats;

public interface ProfileUseCase {
    Profile getPublicProfile(String userId, String requestingUserId);

    Profile updateProfile(String userId, String bio, String avatarUrl);

    ProfileStats getProfileStats(String userId);

    void followUser(String currentUserId, String targetUserId);

    void unfollowUser(String currentUserId, String targetUserId);

    void blockUser(String currentUserId, String targetUserId);

    void unblockUser(String currentUserId, String targetUserId);
}

