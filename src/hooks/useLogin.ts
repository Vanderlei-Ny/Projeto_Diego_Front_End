import { useState } from "react";
import api from "../http/api";
import useAuth from "./useAuth";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function loginWithEmail(email: string, password: string) {
    setLoading(true);
    try {
      const res = await api.post("/login/loginUser", { email, password });
      const data = res.data;

      if (!data.user?.userId) {
        throw new Error("User not found");
      }

      // Save in context
      login({
        userId: data.user.userId,
        token: data.token,
        name: data.user.name ?? null,
        telefone: data.user.telefone ?? null,
      });

      return { data };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle(token: string) {
    setLoading(true);
    try {
      const res = await api.post("/login/authWithGoogle", { token });
      const data = res.data;

      if (!data.id) throw new Error(data?.message || "Error on google auth");

      login({
        userId: data.id,
        name: data.name ?? null,
        telefone: data.telefone ?? null,
        token: data.token ?? null,
      });

      return { data };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    loginWithEmail,
    loginWithGoogle,
  };
}
