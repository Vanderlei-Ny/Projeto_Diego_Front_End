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
    onSuccess: (data) => {
      login({
        userId: data.id,
        name: null,
        telefone: null,
        token: null,
        roles: data.roles ?? data.role ?? null,
      });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const res = await api.post("/login/authWithGoogle", { token });
      const data = res.data;
      if (!data.id)
        throw new Error(data.message || "Erro ao autenticar com Google");

      return data;
    },
    onSuccess: (data) => {
      login({
        userId: data.id,
        name: data.name ?? null,
        telefone: data.telefone ?? null,
        token: data.token ?? null,
        roles: data.roles ?? data.role ?? null,
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
