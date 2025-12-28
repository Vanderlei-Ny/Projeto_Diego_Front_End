import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";

interface Agendamento {
  id: number;
  dataAgendamento: string;
  hour: string;
  nameServices: string[];
}

export default function useHome() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: agendamentos = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["agendamentos", user?.userId],
    queryFn: async () => {
      if (!user?.userId) return [];
      const res = await api.get(
        `/agendamento/listAgendamentoOfUser/${user.userId}`
      );
      const data = res.data;

      return Array.isArray(data)
        ? data.map((item: any, index: number) => ({
            id: item.id ?? index,
            dataAgendamento: item.dataAgendamento,
            hour: item.hour.hourDisponible,
            nameServices: item.service.map((s: any) => s.nameService),
          }))
        : [];
    },
    enabled: !!user?.userId,
  });

  const deleteAgendamentoMutation = useMutation({
    mutationFn: async (agendamentoId: number) => {
      await api.delete(`/agendamento/deleteAgendamento/${agendamentoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
  });

  return {
    agendamentos,
    loading,
    error: error?.message ?? null,
    fetchAgendamentos: () =>
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] }),
    deleteAgendamento: (agendamentoId: number) =>
      deleteAgendamentoMutation.mutateAsync(agendamentoId),
    isDeleting: deleteAgendamentoMutation.isPending,
  };
}
