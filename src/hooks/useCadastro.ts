import { useMutation } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";

export default function useCadastro() {
  const { login } = useAuth();

  const createUserMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await api.post("/user/createUser", { email, password });
      const data = res.data;

      if (!data.id) throw new Error(data.message || "Erro ao cadastrar");

      return data;
    },
    // After creating the user, automatically log them in with the same credentials
    onSuccess: async (_data, variables) => {
      try {
        const loginRes = await api.post("/login/loginUser", {
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
          token: loginData.token ?? null,
          roles:
            loginData.user.Hierarchy ??
            loginData.user.roles ??
            loginData.roles ??
            loginData.user.role ??
            null,
        });
      } catch (err) {
        console.error("Erro ao logar automaticamente após cadastro:", err);
        // Fallback: keep minimal user so insert page can proceed
        login({ userId: _data.id, name: null, telefone: null, token: null });
      }
    },
  });

  const googleAuthMutation = useMutation({
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
        existingUser: raw.existingUser ?? false,
      };

      return normalized;
    },
    onSuccess: (data) => {
      console.log("🎉 Autenticação com sucesso:", data.id);
      login({
        userId: data.id,
        name: data.name ?? null,
        telefone: data.telefone ?? null,
        token: data.token ?? null,
        roles: data.roles ?? null,
      });
    },
  });

  return {
    createUser: (email: string, password: string) =>
      createUserMutation.mutateAsync({ email, password }),
    googleAuth: (token: string) => googleAuthMutation.mutateAsync({ token }),
    isLoadingCreate: createUserMutation.isPending,
    isLoadingGoogle: googleAuthMutation.isPending,
    errorCreate: createUserMutation.error,
    errorGoogle: googleAuthMutation.error,
  };
}
