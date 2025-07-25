package es.uah.pablopinas.catalog.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

public class KeycloakJwtRolesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String PREFIX_REALM_ROLE = "ROLE_realm_";
    private static final String PREFIX_RESOURCE_ROLE = "ROLE_";

    private static final String CLAIM_REALM_ACCESS = "realm_access";
    private static final String CLAIM_RESOURCE_ACCESS = "resource_access";
    private static final String CLAIM_ROLES = "roles";

    // El nombre del cliente asociado a este microservicio
    private static final String LOCAL_CLIENT = "catalog-service";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        // Realm roles
        Map<String, Collection<String>> realmAccess = jwt.getClaim(CLAIM_REALM_ACCESS);
        if (realmAccess != null && !realmAccess.isEmpty()) {
            Collection<String> roles = realmAccess.get(CLAIM_ROLES);
            if (roles != null && !roles.isEmpty()) {
                grantedAuthorities.addAll(roles.stream().map(role -> new SimpleGrantedAuthority(PREFIX_REALM_ROLE + role)).collect(Collectors.toList()));
            }
        }

        // Resource (client) roles
        Map<String, Map<String, Collection<String>>> resourceAccess = jwt.getClaim(CLAIM_RESOURCE_ACCESS);
        if (resourceAccess != null && !resourceAccess.isEmpty()) {
            resourceAccess.forEach((resource, resourceClaims) -> {
                Collection<String> roles = resourceClaims.get(CLAIM_ROLES);
                if (roles != null && !roles.isEmpty()) {
                    roles.forEach(role -> {
                        String authority;
                        if (LOCAL_CLIENT.equals(resource)) {
                            // Si es el microservicio actual, sin prefijo de cliente
                            authority = PREFIX_RESOURCE_ROLE + role.toUpperCase().replace("-", "_");
                        } else {
                            // Prefijo con nombre del cliente
                            authority = PREFIX_RESOURCE_ROLE + resource + "_" + role;
                        }
                        grantedAuthorities.add(new SimpleGrantedAuthority(authority));
                    });
                }
            });
        }

        return grantedAuthorities;
    }
}
