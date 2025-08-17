package es.uah.pablopinas.social.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@RequiredArgsConstructor
@Getter
@Setter
public class User {
    UUID id;
    String username;
    String email;
    String name;
    String lastName;
}

