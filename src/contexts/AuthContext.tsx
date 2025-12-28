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
        if (storedToken) setAuthToken(storedToken);

        const res = await api.post("/login/validateToken");
        const data = res.data;

        console.log("is here", data);

        if (data) {
          // Support multiple response shapes:
          // - { userId, token, name, telefone }
          // - { user: { userId, name, telefone }, token }
          const userPayload = data.user ?? data;
          if (userPayload && (userPayload.userId || userPayload.id)) {
            const parsed = {
              token: data.token ?? userPayload.token ?? null,
              userId: userPayload.userId ?? userPayload.id,
              name: userPayload.name ?? null,
              telefone: userPayload.telefone ?? null,
              // Normalize roles from multiple possible fields and formats
              roles: (() => {
                const rolesRaw =
                  userPayload.roles ??
                  data.roles ??
                  userPayload.role ??
                  userPayload.Hierarchy ??
                  null;
                if (!rolesRaw) return null;
                if (Array.isArray(rolesRaw))
                  return rolesRaw.map((r) => String(r));
                if (typeof rolesRaw === "string")
                  return rolesRaw.split(",").map((r) => r.trim());
                return null;
              })(),
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
    // Normalize roles to an array and set user
    const normalizeRoles = (r?: string[] | string | null) => {
      if (!r) return null;
      if (Array.isArray(r)) return r.map((x) => String(x));
      if (typeof r === "string") return r.split(",").map((s) => s.trim());
      return null;
    };

    const normalized: User = {
      ...userInfo,
      roles: normalizeRoles(
        (userInfo as any).roles ?? (userInfo as any).role ?? null
      ),
    };

    setUser(normalized);

    if (normalized.token) {
      setAuthToken(normalized.token);
      persistAuthToken(normalized.token);
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
