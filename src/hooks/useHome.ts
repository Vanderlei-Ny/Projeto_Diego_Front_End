import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";

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
      if (!user?.userId) {
        return [];
      }

      try {
        const res = await api.get(
          `/agendamento/listAgendamentoOfUser/${user.userId}`
        );
        const data = res.data;

        interface AgendamentoResponse {
          id?: number;
          dataAgendamento: string;
          hour: { availableHour: string };
          service?: Array<{ name: string }>;
        }

        return Array.isArray(data)
          ? data.map((item: AgendamentoResponse, index: number) => ({
              id: item.id ?? index,
              dataAgendamento: item.dataAgendamento,
              hour: item.hour.availableHour,
              nameServices: Array.isArray(item.service)
                ? item.service.map((s) => s.name)
                : [],
            }))
          : [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!user?.userId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
