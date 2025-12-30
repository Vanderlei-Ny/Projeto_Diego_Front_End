import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../http/api";
import useAuth from "./useAuth";
import { toast } from "sonner";

interface Service {
  id: number;
  nameService: string;
  valueService: string;
}

interface HourDisponible {
  id: number;
  hourDisponible: string;
}

interface VerifyDayResponse {
  message: string;
  dayId: number;
  hoursDisponible: HourDisponible[];
  hoursAgendados: HourDisponible[];
}

export default function useAgendamento() {
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
      const res = await api.get("/service/listAllServices");
      return res.data as Service[];
    },
    retry: 2,
  });

  // Verifica disponibilidade de um dia específico
  const verifyDayMutation = useMutation({
    mutationFn: async (date: string) => {
      const res = await api.post("/agendamento/verifyDay", { date });
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
        `/agendamento/createAgendamento/${user.userId}`,
        { data, dayId, hourId, services }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
      // Invalida a query de listagem para atualizar a home
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Erro ao criar agendamento";
      toast.error(message);
    },
  });

  return {
    services,
    loadingServices,
    servicesError,
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
