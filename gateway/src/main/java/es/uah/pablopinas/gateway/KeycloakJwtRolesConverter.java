package es.uah.pablopinas.gateway;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class KeycloakJwtRolesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String CLAIM_REALM_ACCESS = "realm_access";
    private static final String CLAIM_RESOURCE_ACCESS = "resource_access";
    private static final String CLAIM_ROLES = "roles";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        List<GrantedAuthority> out = new ArrayList<>();

        Map<String, Object> realmAccess = jwt.getClaim(CLAIM_REALM_ACCESS);
        if (realmAccess != null) {
            Object roles = realmAccess.get(CLAIM_ROLES);
            if (roles instanceof Collection<?> r) {
                out.addAll(r.stream()
                        .map(Object::toString)
                        .map(this::normalize)
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList()));
            }
        }

        Map<String, Object> resourceAccess = jwt.getClaim(CLAIM_RESOURCE_ACCESS);
        if (resourceAccess != null) {
            for (Map.Entry<String, Object> e : resourceAccess.entrySet()) {
                String clientId = normalize(e.getKey());
                Object client = e.getValue();
                if (client instanceof Map<?, ?> m) {
                    Object roles = m.get(CLAIM_ROLES);
                    if (roles instanceof Collection<?> r) {
                        for (Object roleObj : r) {
                            String role = normalize(String.valueOf(roleObj));
                            out.add(new SimpleGrantedAuthority("ROLE_" + clientId + "_" + role));
                        }
                    }
                }
            }
        }
        return out;
    }

    private String normalize(String s) {
        return s == null ? "" : s.trim().toUpperCase().replace('-', '_');
    }
}
