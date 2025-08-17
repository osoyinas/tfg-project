package es.uah.pablopinas.social.infrastructure.security;

import java.util.Map;
import java.util.Set;

public record AuthUser(
        String id,                 // "sub"
        String username,           // "preferred_username"
        String email,              // "email"
        String name,               // "name" o "given_name"/"family_name"
        Set<String> roles,         // Authorities como nombres de rol (sin "ROLE_")
        Set<String> scopes,        // scopes del token (scope o "scp")
        Map<String, Object> claims,// todos los claims del JWT
        String tokenValue          // el JWT en bruto (útil para downstream calls)
) {
}
