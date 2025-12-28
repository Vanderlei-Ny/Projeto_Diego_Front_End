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
      try {
        const res = await api.post("/login/loginUser", { email, password });
        const data = res.data;

        if (!data.user?.userId) {
          throw new Error("User not found");
        }

        return data;
      } catch (err: any) {
        const serverMsg = err?.response?.data?.message;
        const msg = serverMsg || err?.message || "Erro ao fazer login.";
        throw new Error(msg);
      }
    },
    onSuccess: (data) => {
      login({
        userId: data.user.userId,
        token: data.token,
        name: data.user.name ?? null,
        telefone: data.user.telefone ?? null,
        roles: data.user.roles ?? data.roles ?? data.user.role ?? null,
      });
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      try {
        const res = await api.post("/login/authWithGoogle", { token });
        const data = res.data;

        if (!data.id) throw new Error(data?.message || "Error on google auth");

        return data;
      } catch (err: any) {
        const serverMsg = err?.response?.data?.message;
        const msg =
          serverMsg || err?.message || "Erro ao autenticar com Google.";
        throw new Error(msg);
      }
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
