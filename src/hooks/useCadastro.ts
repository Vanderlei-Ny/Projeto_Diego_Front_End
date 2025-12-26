import { useState } from "react";
import api from "../http/api";
import useAuth from "./useAuth";

export default function useCadastro() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function createUser(email: string, password: string) {
    setLoading(true);
    try {
      const res = await api.post("/user/createUser", { email, password });
      const data = res.data;

      if (!data.id) throw new Error(data.message || "Erro ao cadastrar");

      // For now, set userId in context but we won't have token yet
      login({ userId: data.id, name: null, telefone: null, token: null });
      return { data };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function googleAuth(token: string) {
    setLoading(true);
    try {
      const res = await api.post("/login/authWithGoogle", { token });
      const data = res.data;
      if (!data.id)
        throw new Error(data.message || "Erro ao autenticar com Google");

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

  return { loading, createUser, googleAuth };
}
