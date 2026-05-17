import type { ApiUser } from "./types";
import { api } from "./client";

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    api<ApiUser>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    api<ApiUser>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => api<void>("/api/v1/auth/logout", { method: "POST" }),
  me: () => api<ApiUser>("/api/v1/auth/me"),
  forgotPassword: (email: string) =>
    api<void>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    api<void>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  verifyEmail: (token: string) =>
    api<ApiUser>(
      `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
    ),
  resendVerification: (email: string) =>
    api<void>("/api/v1/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
