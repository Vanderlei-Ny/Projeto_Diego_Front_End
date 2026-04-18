import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../http/api";
import useAuth from "./useAuth";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useLocation, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "@/endpoints";
import type { Service } from "@/types/service/service.types";
import type {
  AdminAgendamento,
  DayData,
} from "@/types/scheduling/scheduling.types";

dayjs.locale("pt-br");

export default function useAdminPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  // Estados para agendamentos
  const [showForm, setShowForm] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [isVerifyingDay, setIsVerifyingDay] = useState(false);

  // Estados do modal de confirmação
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Buscar todos os agendamentos (admin)
  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["admin-agendamentos"],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.scheduling.adminListAll);
      return res.data as AdminAgendamento[];
    },
    enabled: isAdmin,
  });

  // Buscar serviços disponíveis
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.service.base);
      return res.data as Service[];
    },
  });

  // Buscar dias ativos
  const { data: activeDaysData, isLoading: isLoadingActiveDays } = useQuery({
    queryKey: ["activeDays"],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.scheduling.activeDays);
      return res.data.activeDays as string[];
    },
  });

  const activeWeekdays = activeDaysData || [];

  // Verificar disponibilidade do dia
  const verifyDay = useCallback(async (date: Date) => {
    setIsVerifyingDay(true);
    try {
      const dateString = dayjs(date).format("YYYY-MM-DD");
      const res = await api.post(ENDPOINTS.scheduling.verifyDay, {
        date: dateString,
      });
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("quick") !== "1") {
      return;
    }

    setShowForm(true);
    params.delete("quick");
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  // Mutation para criar agendamento
  const createMutation = useMutation({
    mutationFn: async (data: {
      nomeCliente: string;
      data: string;
      dayId: number;
      hourId: number;
      services: number[];
    }) => {
      const res = await api.post(ENDPOINTS.scheduling.adminCreate, data);
      return res.data;
    },
    onSuccess: () => {
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
      const res = await api.delete(ENDPOINTS.scheduling.deleteById(id));
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
        : [...prev, serviceId],
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
    setDeleteModalMessage("Tem certeza que deseja cancelar este agendamento?");
    setPendingDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Funções do modal de confirmação
  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      deleteMutation.mutate(pendingDeleteId);
    }
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteModalMessage("");
    setPendingDeleteId(null);
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
    isLoadingActiveDays,
    isVerifyingDay,
    handleDateSelect,
    handleHourSelect,
    handleServiceToggle,
    handleCreateAgendamento,
    handleDeleteAgendamento,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  };
}
