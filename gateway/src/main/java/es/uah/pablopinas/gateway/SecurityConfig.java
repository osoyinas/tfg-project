package es.uah.pablopinas.gateway;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.cloud.gateway.route.Route;
import reactor.core.publisher.Mono;

import reactor.core.publisher.Flux;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Configuration
@EnableWebFluxSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    @Order(0)
    public SecurityWebFilterChain actuatorChain(ServerHttpSecurity http) {
        return http
                .securityMatcher(ServerWebExchangeMatchers.pathMatchers("/actuator/**"))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(ex -> ex.anyExchange().permitAll())
                .build();
    }

    @Bean
    @Order(1)
    public SecurityWebFilterChain apiChain(ServerHttpSecurity http, ReactiveJwtAuthenticationConverter reactiveJwtAuthConverter) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(ex -> ex
                        .pathMatchers("/swagger/**", "/v3/api-docs/**").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(jsonAuthEntryPoint())
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(reactiveJwtAuthConverter))
                )
                .build();
    }

    @Bean
    public ReactiveJwtAuthenticationConverter reactiveJwtAuthConverter(KeycloakJwtRolesConverter kcConverter) {
        JwtGrantedAuthoritiesConverter scopes = new JwtGrantedAuthoritiesConverter();
        ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Set<GrantedAuthority> authorities = new HashSet<>(scopes.convert(jwt));
            authorities.addAll(kcConverter.convert(jwt));
            return Flux.fromIterable(authorities);
        });
        return converter;
    }

    @Bean
    public ServerAuthenticationEntryPoint jsonAuthEntryPoint() {
        return (exchange, ex) -> {
            var res = exchange.getResponse();
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            res.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            res.getHeaders().add("X-Auth-Error", "gateway");
            res.getHeaders().add("X-Request-Path", exchange.getRequest().getURI().getPath());

            String cause = ex == null ? "Unauthorized" : ex.getMessage();
            String body = """
                    {"error":"unauthorized","source":"gateway","path":"%s","message":"%s"}
                    """.formatted(exchange.getRequest().getURI().getPath(), cause.replace("\"", "'"));

            return res.writeWith(Mono.just(res.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8))));
        };
    }

    @Bean
    public GlobalFilter downstream401MarkerFilter() {
        return (exchange, chain) -> {
            exchange.getResponse().beforeCommit(() -> {
                var res = exchange.getResponse();
                var headers = res.getHeaders();

                boolean alreadyTaggedByGateway = headers.containsKey("X-Auth-Error");
                HttpStatusCode status = res.getStatusCode();

                if (!alreadyTaggedByGateway && status == HttpStatus.UNAUTHORIZED) {
                    Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
                    String routeId = route != null ? route.getId() : "unknown";

                    headers.add("X-Auth-Error", "downstream");
                    headers.add("X-Downstream-Route-Id", routeId);
                    headers.add("X-Request-Path", exchange.getRequest().getURI().getPath());
                }
                return Mono.empty();
            });

            return chain.filter(exchange);
        };
    }
}
