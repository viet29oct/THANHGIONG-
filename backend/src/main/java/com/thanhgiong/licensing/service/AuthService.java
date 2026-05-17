package com.thanhgiong.licensing.service;

import com.thanhgiong.licensing.config.AppProperties;
import com.thanhgiong.licensing.domain.entity.User;
import com.thanhgiong.licensing.domain.enums.Role;
import com.thanhgiong.licensing.dto.auth.AuthDtos.*;
import com.thanhgiong.licensing.exception.ApiException;
import com.thanhgiong.licensing.repository.UserRepository;
import com.thanhgiong.licensing.security.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CookieTokenService cookieTokenService;
    private final EmailService emailService;
    private final AppProperties appProperties;
    private final AuditService auditService;

    @Transactional
    public UserResponse register(RegisterRequest req, HttpServletRequest http) {
        String email = req.email().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }
        var user = User.builder()
                .name(req.name())
                .email(email)
                .password(passwordEncoder.encode(req.password()))
                .role(Role.CUSTOMER)
                .emailVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .build();
        userRepository.save(user);
        emailService.sendVerification(user.getEmail(),
                appProperties.getFrontendUrl() + "/verify-email?token=" + user.getVerificationToken());
        auditService.log(user.getEmail(), "REGISTER", "USER", null, http.getRemoteAddr());
        return toResponse(user);
    }

    public UserResponse login(LoginRequest req, HttpServletResponse response, HttpServletRequest http) {
        var user = userRepository.findByEmail(req.email().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Email not verified. Please check your inbox.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email().toLowerCase(), req.password()));

        cookieTokenService.setTokens(response,
                jwtService.createAccessToken(user.getEmail(), user.getRole().name()),
                jwtService.createRefreshToken(user.getEmail()));
        auditService.log(user.getEmail(), "LOGIN", "USER", null, http.getRemoteAddr());
        return toResponse(user);
    }

    public void logout(HttpServletResponse response) {
        cookieTokenService.clearTokens(response);
    }

    public UserResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refresh = cookieTokenService.getRefreshToken(request);
        if (refresh == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "No refresh token");
        var claims = jwtService.parse(refresh).getPayload();
        if (!jwtService.isRefreshToken(claims)) throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid token");
        var user = userRepository.findByEmail(claims.getSubject()).orElseThrow();
        cookieTokenService.setTokens(response,
                jwtService.createAccessToken(user.getEmail(), user.getRole().name()),
                jwtService.createRefreshToken(user.getEmail()));
        return toResponse(user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {
        userRepository.findByEmail(req.email().toLowerCase()).ifPresent(user -> {
            user.setResetToken(UUID.randomUUID().toString());
            user.setResetTokenExpiresAt(Instant.now().plusSeconds(3600));
            userRepository.save(user);
            emailService.sendResetPassword(user.getEmail(),
                    appProperties.getFrontendUrl() + "/reset-password?token=" + user.getResetToken());
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        var user = userRepository.findByResetToken(req.token())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid token"));
        if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Token expired");
        }
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setResetToken(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse verifyEmail(String token) {
        var user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid token"));
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return toResponse(user);
    }

    @Transactional
    public void resendVerification(ResendVerificationRequest req) {
        userRepository.findByEmail(req.email().toLowerCase()).ifPresent(user -> {
            if (user.isEmailVerified()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Email already verified");
            }
            if (user.getVerificationToken() == null) {
                user.setVerificationToken(UUID.randomUUID().toString());
                userRepository.save(user);
            }
            emailService.sendVerification(user.getEmail(),
                    appProperties.getFrontendUrl() + "/verify-email?token=" + user.getVerificationToken());
        });
    }

    public UserResponse me(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).map(this::toResponse).orElseThrow();
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.isEmailVerified());
    }
}
