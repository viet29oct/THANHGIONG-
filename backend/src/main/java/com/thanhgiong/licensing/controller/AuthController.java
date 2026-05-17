package com.thanhgiong.licensing.controller;

import com.thanhgiong.licensing.dto.auth.AuthDtos.*;
import com.thanhgiong.licensing.security.UserPrincipal;
import com.thanhgiong.licensing.service.AuthService;
import com.thanhgiong.licensing.util.SecurityUtils;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest req, HttpServletRequest http) {
        return authService.register(req, http);
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest req, HttpServletResponse res, HttpServletRequest http) {
        return authService.login(req, res, http);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse res) {
        authService.logout(res);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public UserResponse refresh(HttpServletRequest req, HttpServletResponse res) {
        return authService.refresh(req, res);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgot(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> reset(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify-email")
    public UserResponse verify(@RequestParam String token) {
        return authService.verifyEmail(token);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return authService.me(principal != null ? principal : SecurityUtils.currentUser());
    }
}
