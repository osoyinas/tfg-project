package es.uah.pablopinas.social.infrastructure.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;
import java.util.stream.Collectors;

public final class AuthUserResolver {

    private AuthUserResolver() {
    }

    public static Optional<AuthUser> current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();

            String id = jwt.getSubject(); // "sub"
            String username = claim(jwt, "preferred_username");
            String email = claim(jwt, "email");
            String name = firstNonBlank(
                    claim(jwt, "name"),
                    buildName(jwt) // "given_name family_name"
            );

            // Roles desde authorities (tu converter ya mete ROLE_*)
            Set<String> roles = jwtAuth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(a -> a.startsWith("ROLE_"))
                    .map(a -> a.substring("ROLE_".length()))
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            // Scopes desde claim "scope" (space-separated) o "scp" (array)
            Set<String> scopes = extractScopes(jwt);

            Map<String, Object> claims = Collections.unmodifiableMap(jwt.getClaims());

            String tokenValue = jwt.getTokenValue();

            return Optional.of(new AuthUser(id, username, email, name, roles, scopes, claims, tokenValue));
        }
        return Optional.empty();
    }

    public static AuthUser requireCurrent() {
        return current().orElseThrow(() -> new IllegalStateException("No hay usuario autenticado"));
    }

    // ---- helpers ----
    private static String claim(Jwt jwt, String name) {
        Object v = jwt.getClaims().get(name);
        return v == null ? null : String.valueOf(v);
    }

    private static String buildName(Jwt jwt) {
        String given = claim(jwt, "given_name");
        String family = claim(jwt, "family_name");
        if (isBlank(given) && isBlank(family)) return null;
        return (given == null ? "" : given) + (isBlank(family) ? "" : " " + family);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    @SuppressWarnings("unchecked")
    private static Set<String> extractScopes(Jwt jwt) {
        Object scope = jwt.getClaims().get("scope"); // "openid profile email"
        if (scope instanceof String s) {
            return Arrays.stream(s.split("\\s+"))
                    .filter(x -> !x.isBlank())
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        }
        Object scp = jwt.getClaims().get("scp"); // ["openid","profile"]
        if (scp instanceof Collection<?> c) {
            return c.stream().map(String::valueOf)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        }
        return Set.of();
    }

    private static String firstNonBlank(String a, String b) {
        if (!isBlank(a)) return a;
        if (!isBlank(b)) return b;
        return null;
    }
}
