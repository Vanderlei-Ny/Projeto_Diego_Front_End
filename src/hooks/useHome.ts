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

  console.log("📊 useHome - user:", user?.userId);

  const {
    data: agendamentos = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["agendamentos", user?.userId],
    queryFn: async () => {
      console.log("📥 Buscando agendamentos para usuário:", user?.userId);

      if (!user?.userId) {
        console.log("⚠️ Sem userId ainda");
        return [];
      }

      try {
        const res = await api.get(
          `/agendamento/listAgendamentoOfUser/${user.userId}`
        );
        const data = res.data;

        console.log("✅ Agendamentos recebidos:", data);

        return Array.isArray(data)
          ? data.map((item: any, index: number) => ({
              id: item.id ?? index,
              dataAgendamento: item.dataAgendamento,
              hour: item.hour.hourDisponible,
              nameServices: item.service.map((s: any) => s.nameService),
            }))
          : [];
      } catch (err) {
        console.error("❌ Erro ao buscar agendamentos:", err);
        return [];
      }
    },
    enabled: !!user?.userId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const deleteAgendamentoMutation = useMutation({
    mutationFn: async (agendamentoId: number) => {
      console.log("🗑️ Deletando agendamento:", agendamentoId);
      await api.delete(`/agendamento/deleteAgendamento/${agendamentoId}`);
    },
    onSuccess: () => {
      console.log("✅ Agendamento deletado, invalidando cache");
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
