package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.application.ports.out.UsersPort;
import es.uah.pablopinas.social.domain.User;
import es.uah.pablopinas.social.infrastructure.security.AuthUser;
import es.uah.pablopinas.social.infrastructure.security.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/me")
public class MeController {

    private final UsersPort userPort;

    public MeController(@Autowired UsersPort port) {
        this.userPort = port;
    }

    @GetMapping
    public AuthUser me(@CurrentUser AuthUser user) {
        return user;
    }

    @GetMapping("/id")
    public String myId(@CurrentUser AuthUser user) {
        return user.id();
    }

    @GetMapping("/users")
    public List<User> getUsers(@CurrentUser AuthUser user) {
        String id = user.id();
        return userPort.findAllByIds(
                List.of(UUID.fromString(id))
        );

    }
}
