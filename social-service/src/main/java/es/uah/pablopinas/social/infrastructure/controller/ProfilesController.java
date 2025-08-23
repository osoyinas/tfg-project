package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.application.ports.in.ProfileUseCase;
import es.uah.pablopinas.social.application.ports.out.UserWithProfilesPort;
import es.uah.pablopinas.social.domain.ProfileStats;
import es.uah.pablopinas.social.domain.UserWithProfile;
import es.uah.pablopinas.social.infrastructure.controller.dto.ProfileResponse;
import es.uah.pablopinas.social.infrastructure.controller.dto.UpdateProfileDTO;
import es.uah.pablopinas.social.infrastructure.security.AuthUser;
import es.uah.pablopinas.social.infrastructure.security.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class ProfilesController {

    private final UserWithProfilesPort userPort;
    private final ProfileUseCase profileUseCase;

    public ProfilesController(@Autowired UserWithProfilesPort port, @Autowired ProfileUseCase profileUseCase) {
        this.userPort = port;
        this.profileUseCase = profileUseCase;
    }


    @GetMapping("/me")
    public UserWithProfile me(@CurrentUser AuthUser user) {
        return userPort.getUser(user.id()).orElseThrow();
    }

    @PatchMapping("/me")
    public UserWithProfile updateMe(@CurrentUser AuthUser user, @RequestBody UpdateProfileDTO updated) {
        profileUseCase.updateProfile(user.id(), updated.getBio(), updated.getAvatarUrl());
        return userPort.getUser(user.id()).orElseThrow();
    }

    @GetMapping("/{id}")
    public UserWithProfile getUser(@PathVariable String id) {
        return userPort.getUser(id).orElseThrow();
    }

    @GetMapping("/me/stats")
    public ProfileResponse getMyUserStats(@CurrentUser AuthUser user) {
        String id = user.id();
        ProfileStats stats = profileUseCase.getProfileStats(id);
        UserWithProfile userWithProfile = userPort.getUser(id).orElseThrow();
        ProfileResponse response = new ProfileResponse();
        response.setStats(stats);
        response.setUser(userWithProfile);
        return response;
    }

    @GetMapping("/{id}/stats")
    public ProfileResponse getUserStats(@PathVariable String id) {
        ProfileStats stats = profileUseCase.getProfileStats(id);
        UserWithProfile user = userPort.getUser(id).orElseThrow();
        ProfileResponse response = new ProfileResponse();
        response.setStats(stats);
        response.setUser(user);
        return response;
    }

    @PostMapping("/{id}/follow")
    public void followUser(@CurrentUser AuthUser user, @PathVariable String id) {
        if (user.id().equals(id)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }
        profileUseCase.followUser(user.id(), id);
    }

    @PostMapping("/{id}/unfollow")
    public void unfollowUser(@CurrentUser AuthUser user, @PathVariable String id) {
        if (user.id().equals(id)) {
            throw new IllegalArgumentException("You cannot unfollow yourself");
        }
        profileUseCase.unfollowUser(user.id(), id);
    }

}
