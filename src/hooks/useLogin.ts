import { useMutation } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";

export default function useLogin() {
  const { login } = useAuth();

  const loginWithEmailMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await api.post("/login/loginUser", { email, password });
      const data = res.data;

      if (!data?.user?.id) {
        throw new Error("Usuário não encontrado");
      }

      return data;
    },
    onSuccess: (data) => {
      login({
        userId: data.user.id,
        token: data.token,
        name: data.user.name ?? null,
        telefone: data.user.telefone ?? null,
        hierarchy: data.user.hierarchy ?? null,
        roles:
          data.user.hierarchy ??
          data.user.roles ??
          data.roles ??
          data.user.role ??
          null,
      });
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const payload = { token };

         const res = await api.post("/login/authWithGoogle", payload);
      const raw = res.data;

      if (!raw?.user?.id) {
        throw new Error("Erro ao autenticar com Google.");
      }

      const normalized = {
        id: raw.user.id,
        name: raw.user.name ?? null,
        telefone: raw.user.telefone ?? null,
        token: raw.token ?? null,
        roles: Array.isArray(raw.user.hierarchy) ? raw.user.hierarchy : null,
        hierarchy: raw.user.hierarchy ?? null,
        existingUser: raw.existingUser ?? false,
      };

      return normalized;
    },
    onSuccess: (data) => {
      login({
        userId: data.id,
        name: data.name ?? null,
        telefone: data.telefone ?? null,
        token: data.token ?? null,
        roles: data.roles ?? null,
        hierarchy: data.hierarchy ?? null,
      });
    },
  });

  return {
    loginWithEmail: (email: string, password: string) =>
      loginWithEmailMutation.mutateAsync({ email, password }),
    loginWithGoogle: (token: string) =>
      loginWithGoogleMutation.mutateAsync({ token }),
    isLoadingEmail: loginWithEmailMutation.isPending,
    isLoadingGoogle: loginWithGoogleMutation.isPending,
    errorEmail: loginWithEmailMutation.error,
    errorGoogle: loginWithGoogleMutation.error,
  };
}
