package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.infrastructure.security.AuthUser;
import es.uah.pablopinas.social.infrastructure.security.CurrentUser;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
public class MeController {

    @GetMapping
    public AuthUser me(@CurrentUser AuthUser user) {
        return user;
    }

    @GetMapping("/id")
    public String myId(@CurrentUser AuthUser user) {
        return user.id();
    }
}
