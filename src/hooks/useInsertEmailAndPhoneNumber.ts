import { useMutation } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";

export default function useInsertEmailAndPhoneNumber() {
  const { user, setUser } = useAuth();

  const updateInfoMutation = useMutation({
    mutationFn: async ({
      name,
      telefone,
    }: {
      name: string;
      telefone: string;
    }) => {
      const userId = user?.userId;
      if (!userId) throw new Error("User id is missing");
      const res = await api.put(`/user/createEmailandPhoneNumber/${userId}`, {
        name,
        telefone,
      });

      return res.data;
    },
    onSuccess: (data) => {
      setUser({
        ...(user ?? {}),
        name: data.name ?? data.name,
        telefone: data.telefone ?? data.telefone,
      });
    },
  });

  return {
    updateInfo: (name: string, telefone: string) =>
      updateInfoMutation.mutateAsync({ name, telefone }),
    isLoading: updateInfoMutation.isPending,
    error: updateInfoMutation.error,
  };
}
