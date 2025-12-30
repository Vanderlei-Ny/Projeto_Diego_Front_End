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
        hierarchy: data.user.Hierarchy ?? null,
        roles:
          data.user.Hierarchy ??
          data.user.roles ??
          data.roles ??
          data.user.role ??
          null,
      });
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      console.log(
        "📤 Enviando token para backend...",
        token ? "OK (tamanho: " + token.length + ")" : "VAZIO"
      );
      console.log("📤 Token primeiros 50 caracteres:", token.substring(0, 50));

      const payload = { token };
      console.log("📤 Payload que será enviado:", {
        hasToken: !!payload.token,
        tokenLength: payload.token?.length,
      });

      const res = await api.post("/login/authWithGoogle", payload);
      const raw = res.data;

      console.log("✅ Resposta recebida:", raw);

      if (!raw?.user?.id) {
        throw new Error("Erro ao autenticar com Google.");
      }

      const normalized = {
        id: raw.user.id,
        name: raw.user.name ?? null,
        telefone: raw.user.telefone ?? null,
        token: raw.token ?? null,
        roles: Array.isArray(raw.user.Hierarchy) ? raw.user.Hierarchy : null,
        hierarchy: raw.user.Hierarchy ?? null,
        existingUser: raw.existingUser ?? false,
      };

      return normalized;
    },
    onSuccess: (data) => {
      console.log("🎉 Login com sucesso:", data.id);
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
