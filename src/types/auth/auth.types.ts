import type { ReactNode } from "react";

export type Hierarchy = "CLIENT" | "ADMIN";

export interface AuthUser {
  userId: number | null;
  name?: string | null;
  telefone?: string | null;
  token?: string | null;
  roles?: string[] | null;
  hierarchy?: Hierarchy | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
