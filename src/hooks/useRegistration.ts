import { useMutation } from "@tanstack/react-query";
import api from "../http/api";
import { signInWithGoogleCredential } from "../http/googleSignIn";
import useAuth from "./useAuth";
import { ENDPOINTS } from "@/endpoints";
import { toHierarchy } from "@/types/auth/auth.types";

export default function useRegistration() {
  const { login } = useAuth();

  const createUserMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await api.post(ENDPOINTS.user.create, { email, password });
      const data = res.data;

      if (!data.id) throw new Error(data.message || "Erro ao cadastrar");

      return data;
    },
    // After creating the user, automatically log them in with the same credentials
    onSuccess: async (_data, variables) => {
      try {
        const loginRes = await api.post(ENDPOINTS.auth.loginWithEmail, {
          email: variables.email,
          password: variables.password,
        });
        const loginData = loginRes.data;

        if (!loginData?.user?.id || !loginData?.token) {
          throw new Error("Falha ao autenticar após cadastro");
        }

        login({
          userId: loginData.user.id,
          name: loginData.user.name ?? null,
          telefone: loginData.user.telefone ?? null,
          avatarUrl: loginData.user.avatarUrl ?? null,
          token: loginData.token ?? null,
          roles:
            loginData.user.Hierarchy ??
            loginData.user.roles ??
            loginData.roles ??
            loginData.user.role ??
            null,
        });
      } catch (err) {
        // Fallback: keep minimal user so insert page can proceed
        login({ userId: _data.id, name: null, telefone: null, token: null });
      }
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: async ({ credential }: { credential: string }) => {

      const raw = await signInWithGoogleCredential(credential);

      return {
        id: raw.user.id,
        name: raw.user.name ?? null,
        telefone: raw.user.telefone ?? null,
        avatarUrl: raw.user.avatarUrl ?? null,
        token: raw.token ?? null,
        hierarchy: raw.user.hierarchy ?? null,
        existingUser: raw.existingUser ?? false,
      };
    },
    onSuccess: (data) => {
      login({
        userId: data.id,
        name: data.name ?? null,
        telefone: data.telefone ?? null,
        avatarUrl: data.avatarUrl ?? null,
        token: data.token ?? null,
        roles: null,
        hierarchy: toHierarchy(data.hierarchy),
      });
    },
  });

  return {
    createUser: (email: string, password: string) =>
      createUserMutation.mutateAsync({ email, password }),
    googleAuth: (credential: string) =>
      googleAuthMutation.mutateAsync({ credential }),
    isLoadingCreate: createUserMutation.isPending,
    isLoadingGoogle: googleAuthMutation.isPending,
    errorCreate: createUserMutation.error,
    errorGoogle: googleAuthMutation.error,
  };
}
