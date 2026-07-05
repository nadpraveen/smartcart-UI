/* ===== AUTH API =====
 * Thin wrappers around the shared client.
 * Each function maps to one backend endpoint.
 */
import { apiClient } from "./client";

export const authApi = {
  /* Register new user → { user, accessToken, refreshToken } */
  register: (data: { name: string; phone: string; otp: string }) =>
    apiClient.post("/api/v1/auth/register", data),

  /* Login existing user → { user, accessToken, refreshToken } */
  login: (data: { phone: string; otp: string }) =>
    apiClient.post("/api/v1/auth/login", data),

  generateSecureToken: (data: { token: string }) =>
    apiClient.post('/api/v1/users/genSecureWhatsappToken', data),
};