package es.uah.pablopinas.tfg.auth_service.adapters.out.jwt;

import es.uah.pablopinas.tfg.auth_service.application.port.in.AuthTokens;
import es.uah.pablopinas.tfg.auth_service.application.port.out.TokenPort;
import es.uah.pablopinas.tfg.auth_service.domain.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider implements TokenPort {

    private Key key;

    @Value("${jwt.secret}")
    private String secretBase64;

    @Value("${jwt.access-token-validity-seconds}")
    private long accessTokenValiditySeconds;

    @Value("${jwt.refresh-token-validity-seconds}")
    private long refreshTokenValiditySeconds;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secretBase64);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public AuthTokens generateTokens(User user) {
        Instant now = Instant.now();

        String accessToken = Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(accessTokenValiditySeconds)))
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .signWith(key)
                .compact();

        String refreshToken = Jwts.builder().setSubject(user.getId().toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(refreshTokenValiditySeconds)))
                .signWith(key)
                .compact();

        AuthTokens authTokens = AuthTokens.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(accessTokenValiditySeconds * 1000L)
                .build();
        return authTokens;

    }

    @Override
    public boolean validateAccessToken(String token) {
        return validateToken(token);
    }

    @Override
    public boolean validateRefreshToken(String refreshToken) {
        return validateToken(refreshToken);
    }

    private boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @Override
    public String getUserIdFromAccessToken(String token) {
        return getUserId(token);
    }

    @Override
    public String getUserIdFromRefreshToken(String refreshToken) {
        return getUserId(refreshToken);
    }

    private String getUserId(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();

        return claims.getSubject();
    }
}
