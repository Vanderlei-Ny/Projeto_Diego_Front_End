import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { ENDPOINTS } from "@/endpoints";

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (typeof raw === "string") {
    const trimmed = raw.trim().replace(/^["']|["']$/g, "");
    if (trimmed.length > 0) return trimmed.replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  return "http://localhost:3001/api";
}

const API_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Allow sending/receiving cookies for HttpOnly cookie-based auth
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;
type RetryRequestConfig = InternalAxiosRequestConfig & {
  __isRetryRequest?: boolean;
};

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await api.post(ENDPOINTS.auth.refreshSession);
    const token = res.data?.token as string | undefined;
    if (token) {
      setAuthToken(token);
      persistAuthToken(token);
      return token;
    }
    return null;
  } catch (err) {
    setAuthToken(null);
    persistAuthToken(null);
    return null;
  } finally {
    refreshPromise = null;
  }
}

// Helper to set token in default headers
export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * 401 em login/senha ou Google não deve disparar refresh (credenciais inválidas).
 * validateToken e demais rotas: access JWT expirado → uma tentativa de POST /login/refresh
 * (cookie httpOnly) e repetição da requisição.
 */
function shouldSkipRefreshForUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(ENDPOINTS.auth.loginWithEmail) ||
    url.includes(ENDPOINTS.auth.loginWithGoogle) ||
    url.includes(ENDPOINTS.auth.logout) ||
    url.includes(ENDPOINTS.auth.refreshSession)
  );
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (originalRequest?.__isRetryRequest) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Sessão expirada. Faça login novamente.";
      toast.error(message);
      setAuthToken(null);
      persistAuthToken(null);
      return Promise.reject(error);
    }

    const requestUrl = originalRequest?.url;
    const skipRefresh = shouldSkipRefreshForUrl(requestUrl);

    if (status === 401 && !skipRefresh) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const newToken = await refreshPromise;
      if (newToken && originalRequest) {
        originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        originalRequest.__isRetryRequest = true;
        return api(originalRequest);
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erro ao processar requisição";
    toast.error(message);
    return Promise.reject(error);
  },
);

// Persistence helpers — we only persist the token (no user data) as requested.
const TOKEN_KEY = "auth_token";
export function persistAuthToken(token?: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // localStorage may be unavailable in some environments; ignore errors
  }
}

export function getPersistedAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

// We keep `setAuthToken` utility for cases we need to attach token manually.
export default api;
