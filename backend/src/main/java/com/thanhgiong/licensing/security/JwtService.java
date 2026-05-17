package com.thanhgiong.licensing.security;

import com.thanhgiong.licensing.config.AppProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final SecretKey key;
    private final long accessMs;
    private final long refreshMs;

    public JwtService(AppProperties props) {
        this.key = Keys.hmacShaKeyFor(props.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
        this.accessMs = props.getJwt().getAccessExpirationMs();
        this.refreshMs = props.getJwt().getRefreshExpirationMs();
    }

    public String createAccessToken(String email, String role) {
        return build(email, role, accessMs, "access");
    }

    public String createRefreshToken(String email) {
        return build(email, null, refreshMs, "refresh");
    }

    private String build(String email, String role, long ttl, String type) {
        var builder = Jwts.builder()
                .subject(email)
                .claim("type", type)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttl));
        if (role != null) builder.claim("role", role);
        return builder.signWith(key).compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
    }

    public boolean isAccessToken(Claims claims) {
        return "access".equals(claims.get("type", String.class));
    }

    public boolean isRefreshToken(Claims claims) {
        return "refresh".equals(claims.get("type", String.class));
    }
}
