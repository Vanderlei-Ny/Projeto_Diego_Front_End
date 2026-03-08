import { createContext, useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import {
  setAuthToken,
  persistAuthToken,
  getPersistedAuthToken,
  refreshAccessToken,
} from "../http/api";
import api from "../http/api";
import { ENDPOINTS } from "@/endpoints";
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
} from "@/types/auth/auth.types";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate token on mount and restore session using the persisted token (only the token is stored in localStorage).
  // The backend should still validate the token — we only persist the token string for use across reloads.
  useEffect(() => {
    async function validate() {
      try {
        // Apply any token persisted from previous sessions so the validate endpoint
        // receives the Authorization header automatically.
        const storedToken = getPersistedAuthToken();
        if (!storedToken) {
          // No token persisted — skip validation call to avoid noisy toasts
          setUser(null);
          setLoading(false);
          return;
        }
        setAuthToken(storedToken);

        const res = await api.post(ENDPOINTS.auth.validateToken);
        const data = res.data;

        if (data) {
          const userPayload = data.user ?? data;
          if (userPayload && userPayload.id) {
            const parsed = {
              token: data.token ?? userPayload.token ?? null,
              userId: userPayload.id,
              name: userPayload.name ?? null,
              telefone: userPayload.telefone ?? userPayload.phoneNumber ?? null,
              roles: Array.isArray(userPayload.roles)
                ? userPayload.roles
                : Array.isArray(data.roles)
                  ? data.roles
                  : null,
              hierarchy: userPayload.hierarchy ?? null,
            } as AuthUser;
            setUser(parsed);
            if (parsed.token) {
              setAuthToken(parsed.token);
              persistAuthToken(parsed.token);
            }
          }
        }
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        // If token validation failed with 401, try to refresh
        if (axiosErr?.response?.status === 401) {
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              // Retry validation with the new token
              const res = await api.post(ENDPOINTS.auth.validateToken);
              const data = res.data;

              if (data) {
                const userPayload = data.user ?? data;
                if (userPayload && userPayload.id) {
                  const parsed = {
                    token: newToken,
                    userId: userPayload.id,
                    name: userPayload.name ?? null,
                    telefone:
                      userPayload.telefone ?? userPayload.phoneNumber ?? null,
                    roles: Array.isArray(userPayload.roles)
                      ? userPayload.roles
                      : Array.isArray(data.roles)
                        ? data.roles
                        : null,
                    hierarchy: userPayload.hierarchy ?? null,
                  } as AuthUser;
                  setUser(parsed);
                  setAuthToken(newToken);
                  persistAuthToken(newToken);
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (_refreshErr) {
            // Refresh also failed, clear session
          }
        }
        // token invalid or validation failed — ensure we don't keep a stale user
        setUser(null);
        setAuthToken(null);
        persistAuthToken(null);
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, []);

  const login = (userInfo: AuthUser) => {
    // Persist only the token in localStorage for session restore; do not store
    // other user properties in localStorage for security.
    setUser(userInfo);
    if (userInfo.token) {
      setAuthToken(userInfo.token);
      persistAuthToken(userInfo.token);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    persistAuthToken(null);
  };

  const isAdmin = user?.hierarchy === "ADMIN";

  const value = useMemo(
    () => ({ user, setUser, login, logout, loading, isAdmin }),
    [user, loading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
