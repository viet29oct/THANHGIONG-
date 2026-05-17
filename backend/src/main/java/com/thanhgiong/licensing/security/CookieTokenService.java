package com.thanhgiong.licensing.security;

import com.thanhgiong.licensing.config.AppProperties;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CookieTokenService {
    private final AppProperties props;

    public void setTokens(HttpServletResponse response, String access, String refresh) {
        response.addHeader("Set-Cookie", build("access_token", access, props.getJwt().getAccessExpirationMs() / 1000).toString());
        response.addHeader("Set-Cookie", build("refresh_token", refresh, props.getJwt().getRefreshExpirationMs() / 1000).toString());
    }

    public void clearTokens(HttpServletResponse response) {
        response.addHeader("Set-Cookie", build("access_token", "", 0).toString());
        response.addHeader("Set-Cookie", build("refresh_token", "", 0).toString());
    }

    public String getRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (var c : request.getCookies()) {
            if ("refresh_token".equals(c.getName())) return c.getValue();
        }
        return null;
    }

    private ResponseCookie build(String name, String value, long maxAgeSeconds) {
        var b = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(props.getCookie().isSecure())
                .path("/")
                .sameSite(props.getCookie().getSameSite())
                .maxAge(maxAgeSeconds);
        if (props.getCookie().getDomain() != null && !props.getCookie().getDomain().isBlank()) {
            b.domain(props.getCookie().getDomain());
        }
        return b.build();
    }
}
