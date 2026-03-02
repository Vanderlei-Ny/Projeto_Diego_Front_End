export const AUTH_ENDPOINTS = {
  loginWithEmail: "/login/loginUser",
  loginWithGoogle: "/login/authWithGoogle",
  validateToken: "/login/validateToken",
  refreshSession: "/login/refresh",
  logout: "/login/logout",
} as const;
