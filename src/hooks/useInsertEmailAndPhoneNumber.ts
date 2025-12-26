import { useState } from "react";
import api from "../http/api";
import useAuth from "./useAuth";

export default function useInsertEmailAndPhoneNumber() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function updateInfo(name: string, telefone: string) {
    setLoading(true);
    try {
      const userId = user?.userId;
      if (!userId) throw new Error("User id is missing");
      const res = await api.put(`/user/createEmailandPhoneNumber/${userId}`, {
        name,
        telefone,
      });

      // Update context
      const data = res.data;
      setUser({
        ...(user ?? {}),
        name: data.name ?? name,
        telefone: data.telefone ?? telefone,
      });

      return { data };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, updateInfo };
}
