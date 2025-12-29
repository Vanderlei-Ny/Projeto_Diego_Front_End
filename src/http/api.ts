import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Allow sending/receiving cookies for HttpOnly cookie-based auth
  withCredentials: true,
});

// Helper to set token in default headers
export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (config.url?.includes("authWithGoogle")) {
      console.log("📤 [REQUEST] Enviando para:", config.url);
      console.log("📤 [REQUEST] Headers:", config.headers);
      console.log("📤 [REQUEST] Body:", config.data);
      console.log("📤 [REQUEST] Body type:", typeof config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Erro ao processar requisição";
    toast.error(message);
    return Promise.reject(error);
  }
);

// Persistence helpers — we only persist the token (no user data) as requested.
const TOKEN_KEY = "auth_token";
export function persistAuthToken(token?: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // localStorage may be unavailable in some environments; ignore errors
    console.warn("Could not access localStorage to persist auth token.", e);
  }
}

export function getPersistedAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Could not access localStorage to read auth token.", e);
    return null;
  }
}

// We keep `setAuthToken` utility for cases we need to attach token manually.
export default api;
