/**
 * Client ID do tipo "Web application" (Google Cloud Console).
 * Deve ser o mesmo valor usado em GOOGLE_CLIENT_ID no backend (audience do ID token).
 */
export const GOOGLE_WEB_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? "";

export function isGoogleSignInConfigured(): boolean {
  return GOOGLE_WEB_CLIENT_ID.length > 0;
}
