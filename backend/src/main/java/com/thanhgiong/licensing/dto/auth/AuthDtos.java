package com.thanhgiong.licensing.dto.auth;

import jakarta.validation.constraints.*;

public class AuthDtos {
    public record RegisterRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 100) String password) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record ForgotPasswordRequest(@NotBlank @Email String email) {}

    public record ResetPasswordRequest(@NotBlank String token, @NotBlank @Size(min = 8) String password) {}

    public record UserResponse(Long id, String name, String email, String role, boolean emailVerified) {}
}
