package es.uah.pablopinas.social.application.service;

import es.uah.pablopinas.social.application.ports.in.ProfileUseCase;
import es.uah.pablopinas.social.application.ports.out.*;
import es.uah.pablopinas.social.domain.Block;
import es.uah.pablopinas.social.domain.Follow;
import es.uah.pablopinas.social.domain.Profile;
import es.uah.pablopinas.social.domain.ProfileStats;
import es.uah.pablopinas.social.domain.exceptions.ForbiddenException;
import es.uah.pablopinas.social.domain.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService implements ProfileUseCase {
    private final ProfilePort profileRepo;
    private final FollowPort followRepo;
    private final BlocksPort blockRepo;
    private final ReviewsPort reviewRepo;
    private final LikesPort likeRepo;
    private final ActivityPort activityPort;

    @SuppressWarnings("all")
    private final ListsPort listsPort;

    public Profile getPublicProfile(String userId, String requestingUserId) {
        return profileRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found"));
    }

    public Profile updateProfile(String userId, String bio, String avatarUrl, Boolean privateFlag) {
        Profile profile = profileRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found"));
        profile.updateProfile(bio, avatarUrl, privateFlag);
        return profileRepo.save(profile);
    }

    public ProfileStats getProfileStats(String userId) {
        long followers = followRepo.countByFolloweeId(userId);
        long following = followRepo.countByFollowerId(userId);
        long reviews = reviewRepo.countByUserId(userId);
        long likesReceived = likeRepo.countLikesReceivedByUser(userId);
        long publicLists = listsPort.countPublicLists(userId); // via another microservice
        return new ProfileStats(followers, following, reviews, likesReceived, publicLists);
    }

    public void followUser(String currentUserId, String targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot follow oneself");
        }
        // Check not already following:
        boolean exists = followRepo.existsByFollowerIdAndFolloweeId(currentUserId, targetUserId);
        if (exists) return; // idempotente: ya sigue
        // Check not blocked:
        if (blockRepo.existsBySourceUserAndTargetUser(targetUserId, currentUserId)) {
            // Si el targetUser bloqueó al currentUser, no puede seguirle
            throw new ForbiddenException("You are blocked by that user");
        }
        Follow relation = new Follow(currentUserId, targetUserId);
        followRepo.save(relation);
        activityPort.notifyActivity(relation);
    }

    public void unfollowUser(String currentUserId, String targetUserId) {
        followRepo.deleteByFollowerIdAndFolloweeId(currentUserId, targetUserId);
        // Podríamos también eliminar notificaciones pendientes relacionadas, etc.
    }

    public void blockUser(String currentUserId, String targetUserId) {
        if (blockRepo.existsBySourceUserAndTargetUser(currentUserId, targetUserId)) return;
        // Si ya lo sigue, quizás eliminar esa relación:
        followRepo.deleteByFollowerIdAndFolloweeId(currentUserId, targetUserId);
        followRepo.deleteByFollowerIdAndFolloweeId(targetUserId, currentUserId);
        // Eliminar cualquier relación de seguimiento mutua para evitar acceso indirecto
        Block block = new Block(currentUserId, targetUserId);
        blockRepo.save(block);
        // Podríamos también quitar a targetUser de tus seguidores y viceversa
    }

    public void unblockUser(String currentUserId, String targetUserId) {
        blockRepo.deleteBySourceUserAndTargetUser(currentUserId, targetUserId);
    }

}
