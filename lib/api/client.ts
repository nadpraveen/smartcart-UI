/* ===== SHARED API CLIENT =====
 * Single place for:
 *   - Base URL config
 *   - Bearer token injection (reads from cookie)
 *   - Auto 401 → refresh → retry
 *   - Unified error handling → throws ApiError
 *
 * Token cookie (set by store): "sc_token" and "sc_refresh"
 * These are JS-readable cookies (not httpOnly) — the API
 * client reads them and sends as Authorization: Bearer header.
 * The backend authGuard stays unchanged.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://smart-cart-backend-b039.onrender.com/api/v1";
const TOKEN_COOKIE = "sc_token";
const REFRESH_COOKIE = "sc_refresh";

/* ===== Helpers to read/write cookies ===== */
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : "";
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/* ===== Token management helpers (exported for store use) ===== */
export function setTokens(access: string, refresh: string) {
  setCookie(TOKEN_COOKIE, access, 1);     // 1 day
  setCookie(REFRESH_COOKIE, refresh, 30); // 30 days
}

export function clearTokens() {
  removeCookie(TOKEN_COOKIE);
  removeCookie(REFRESH_COOKIE);
}

export function getAccessToken(): string {
  return getCookie(TOKEN_COOKIE);
}

/* ===== Custom error class ===== */
export class ApiError extends Error {
  constructor(
    public status: number,
    public type: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ===== Core fetch wrapper ===== */
async function request(method: string, path: string, body?: unknown): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Attach Bearer token from cookie
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Make the request
  let res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401 — try once with refresh token
  if (res.status === 401) {
    const refresh = getCookie(REFRESH_COOKIE);
    if (refresh) {
      const refreshed = await tryRefresh(refresh);
      if (refreshed) {
        headers["Authorization"] = `Bearer ${getAccessToken()}`;
        res = await fetch(`${BASE_URL}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
      }
    }
  }

  // Parse response
  const json = await res.json();

  if (!json.success) {
    throw new ApiError(
      res.status,
      json.error?.type || "UNKNOWN",
      json.error?.message || "Something went wrong",
    );
  }

  return json.data;
}

/* ===== Attempt token refresh ===== */
async function tryRefresh(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (json.success && json.data?.accessToken) {
      setTokens(json.data.accessToken, refreshToken); // keep same refresh token
      return true;
    }
  } catch {
    // Refresh failed — ignore, caller will handle 401
  }
  return false;
}

/* ===== Public API ===== */
export const apiClient = {
  get:    (path: string)            => request("GET", path),
  post:   (path: string, body?: any) => request("POST", path, body),
  put:    (path: string, body?: any) => request("PUT", path, body),
  patch:  (path: string, body?: any) => request("PATCH", path, body),
  delete: (path: string, body?: any) => request("DELETE", path, body),
};
