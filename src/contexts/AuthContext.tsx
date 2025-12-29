import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  setAuthToken,
  persistAuthToken,
  getPersistedAuthToken,
} from "../http/api";
import api from "../http/api";

interface User {
  userId: number | null;
  name?: string | null;
  telefone?: string | null;
  token?: string | null;
  roles?: string[] | null;
}

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

        const res = await api.post("/login/validateToken");
        const data = res.data;

        if (data) {
          const userPayload = data.user ?? data;
          if (userPayload && userPayload.id) {
            const parsed = {
              token: data.token ?? userPayload.token ?? null,
              userId: userPayload.id,
              name: userPayload.name ?? null,
              telefone: userPayload.telefone ?? null,
              roles: Array.isArray(userPayload.roles)
                ? userPayload.roles
                : Array.isArray(data.roles)
                ? data.roles
                : null,
            } as User;
            setUser(parsed);
            if (parsed.token) {
              setAuthToken(parsed.token);
              persistAuthToken(parsed.token);
            }
          }
        }
      } catch (err) {
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

  const login = (userInfo: User) => {
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

  const value = useMemo(
    () => ({ user, setUser, login, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
