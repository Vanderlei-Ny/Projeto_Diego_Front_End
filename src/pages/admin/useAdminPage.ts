import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../http/api";
import useAuth from "../../hooks/useAuth";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface Service {
  id: number;
  nameService: string;
  valueService: string;
}

interface AgendamentoService {
  id: number;
  nome: string;
  valor: string;
}

interface Agendamento {
  id: number;
  dataAgendamento: string;
  dataOriginal: string;
  nomeCliente: string;
  telefone: string | null;
  email: string | null;
  userId: number | null;
  agendado: boolean;
  horario: string;
  diaDaSemana: string;
  services: AgendamentoService[];
}

interface Hour {
  id: number;
  hourDisponible: string;
}

interface DayData {
  dayId: number;
  hoursDisponible: Hour[];
  hoursAgendados: Hour[];
}

export default function useAdminPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Estados para agendamentos
  const [showForm, setShowForm] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [isVerifyingDay, setIsVerifyingDay] = useState(false);

  // Buscar todos os agendamentos (admin)
  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["admin-agendamentos"],
    queryFn: async () => {
      const res = await api.get("/agendamento/admin/listAll");
      return res.data as Agendamento[];
    },
    enabled: isAdmin,
  });

  // Buscar serviços disponíveis
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get("/service");
      return res.data as Service[];
    },
  });

  // Buscar dias ativos
  const { data: activeDaysData } = useQuery({
    queryKey: ["activeDays"],
    queryFn: async () => {
      const res = await api.get("/agendamento/activeDays");
      return res.data.activeDays as string[];
    },
  });

  const activeWeekdays = activeDaysData || [];

  // Verificar disponibilidade do dia
  const verifyDay = useCallback(async (date: Date) => {
    setIsVerifyingDay(true);
    try {
      const res = await api.post("/agendamento/verifyDay", { date });
      const data = res.data;
      setDayData({
        dayId: data.dayId,
        hoursDisponible: data.hoursDisponible || [],
        hoursAgendados: data.hoursAgendados || [],
      });
    } catch {
      setDayData(null);
    } finally {
      setIsVerifyingDay(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      verifyDay(selectedDate);
      setSelectedHour(null);
    }
  }, [selectedDate, verifyDay]);

  // Mutation para criar agendamento
  const createMutation = useMutation({
    mutationFn: async (data: {
      nomeCliente: string;
      data: string;
      dayId: number;
      hourId: number;
      services: number[];
    }) => {
      const res = await api.post("/agendamento/admin/createAgendamento", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["admin-agendamentos"] });
      // Resetar formulário
      setNomeCliente("");
      setSelectedDate(undefined);
      setSelectedHour(null);
      setSelectedServices([]);
      setShowForm(false);
      setDayData(null);
    },
  });

  // Mutation para deletar agendamento
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/agendamento/deleteAgendamento/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agendamento cancelado!");
      queryClient.invalidateQueries({ queryKey: ["admin-agendamentos"] });
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleHourSelect = (hourId: number) => {
    setSelectedHour(hourId);
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleCreateAgendamento = () => {
    if (
      !nomeCliente.trim() ||
      !selectedDate ||
      !selectedHour ||
      selectedServices.length === 0 ||
      !dayData
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      nomeCliente: nomeCliente.trim(),
      data: dayjs(selectedDate).format("YYYY-MM-DD"),
      dayId: dayData.dayId,
      hourId: selectedHour,
      services: selectedServices,
    });
  };

  const handleDeleteAgendamento = (id: number) => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      deleteMutation.mutate(id);
    }
  };

  return {
    agendamentos,
    services,
    isLoading,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    showForm,
    setShowForm,
    selectedDate,
    selectedHour,
    selectedServices,
    nomeCliente,
    setNomeCliente,
    hoursDisponible: dayData?.hoursDisponible || [],
    hoursAgendados: dayData?.hoursAgendados || [],
    activeWeekdays,
    isVerifyingDay,
    handleDateSelect,
    handleHourSelect,
    handleServiceToggle,
    handleCreateAgendamento,
    handleDeleteAgendamento,
  };
}
