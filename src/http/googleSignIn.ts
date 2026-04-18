import api from "./api";
import { ENDPOINTS } from "@/endpoints";

export type GoogleSignInApiUser = {
  id: number;
  email: string;
  name: string | null;
  telefone: string | null;
  avatarUrl?: string | null;
  hierarchy: string | null;
};

export type GoogleSignInApiResponse = {
  user: GoogleSignInApiUser;
  token: string;
  existingUser?: boolean;
  message?: string;
};

/**
 * Envia o JWT retornado pelo Google Identity Services (`credential`) ao backend para verificação e sessão própria.
 */
export async function signInWithGoogleCredential(
  credential: string,
): Promise<GoogleSignInApiResponse> {
  const res = await api.post<GoogleSignInApiResponse>(
    ENDPOINTS.auth.loginWithGoogle,
    { credential },
  );
  const raw = res.data;
  if (!raw?.user?.id || !raw.token) {
    throw new Error("Resposta inválida do servidor após login com Google.");
  }
  return raw;
}
