import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";
import { toast } from "sonner";
import { ENDPOINTS } from "@/endpoints";
import type { Service } from "@/types/service/service.types";
import type { VerifyDayResponse } from "@/types/scheduling/scheduling.types";

export default function useScheduling() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Lista todos os serviços disponíveis
  const {
    data: services = [],
    isLoading: loadingServices,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.service.listAllPublic);
      return res.data as Service[];
    },
    retry: 2,
  });

  // Busca dias bloqueados (folgas, feriados, etc)
  const { data: diasBloqueadosData, isLoading: isLoadingDiasBloqueados } =
    useQuery({
      queryKey: ["diasBloqueadosDatas"],
      queryFn: async () => {
        const res = await api.get(ENDPOINTS.blockedDay.dates);
        return res.data.diasBloqueados as string[];
      },
      retry: 2,
    });

  const diasBloqueados = diasBloqueadosData || [];

  // Verifica disponibilidade de um dia específico
  const verifyDayMutation = useMutation({
    mutationFn: async (date: string) => {
      const res = await api.post(ENDPOINTS.scheduling.verifyDay, { date });
      return res.data as VerifyDayResponse;
    },
  });

  // Cria um novo agendamento
  const createAgendamentoMutation = useMutation({
    mutationFn: async ({
      data,
      dayId,
      hourId,
      services,
    }: {
      data: string;
      dayId: number;
      hourId: number;
      services: number[];
    }) => {
      if (!user?.userId) throw new Error("Usuário não autenticado");
      const res = await api.post(
        ENDPOINTS.scheduling.createByUser(user.userId),
        {
          data,
          dayId,
          hourId,
          services,
        },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
      // Invalida a query de listagem para atualizar a home
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      const message =
        error?.response?.data?.message || "Erro ao criar agendamento";
      toast.error(message);
    },
  });

  return {
    services,
    loadingServices,
    servicesError,
    diasBloqueados,
    isLoadingDiasBloqueados,
    verifyDay: (date: string) => verifyDayMutation.mutateAsync(date),
    createAgendamento: (data: {
      data: string;
      dayId: number;
      hourId: number;
      services: number[];
    }) => createAgendamentoMutation.mutateAsync(data),
    isVerifyingDay: verifyDayMutation.isPending,
    isCreatingAgendamento: createAgendamentoMutation.isPending,
    dayData: verifyDayMutation.data,
    resetDayData: () => verifyDayMutation.reset(),
  };
}
