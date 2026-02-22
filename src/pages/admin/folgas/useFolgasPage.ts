import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../http/api";
import useAuth from "../../../hooks/useAuth";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface DiaBloqueado {
  id: number;
  data: string;
  dataFormatada: string;
  diaSemana: string;
  motivo: string | null;
}

interface AgendamentoNoDia {
  id: number;
  cliente: string;
  horario: string;
}

export default function useFolgasPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Estados
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [motivo, setMotivo] = useState("");
  const [agendamentosNoDia, setAgendamentosNoDia] = useState<
    AgendamentoNoDia[]
  >([]);
  const [showAgendamentosWarning, setShowAgendamentosWarning] = useState(false);

  // Estados do modal de confirmação
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Buscar todos os dias bloqueados
  const { data: diasBloqueados = [], isLoading: isLoadingDias } = useQuery({
    queryKey: ["diasBloqueados"],
    queryFn: async () => {
      const res = await api.get("/diaBloqueado");
      return res.data as DiaBloqueado[];
    },
    enabled: isAdmin,
  });

  // Mutation para criar dia bloqueado
  const createDiaBloqueadoMutation = useMutation({
    mutationFn: async (data: { data: string; motivo: string }) => {
      const res = await api.post("/diaBloqueado/create", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Dia bloqueado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["diasBloqueados"] });
      setSelectedDate(undefined);
      setMotivo("");
      setAgendamentosNoDia([]);
      setShowAgendamentosWarning(false);
    },
    onError: (error: any) => {
      if (error.response?.data?.agendamentos) {
        setAgendamentosNoDia(error.response.data.agendamentos);
        setShowAgendamentosWarning(true);
        toast.error("Existem agendamentos neste dia!");
      } else {
        toast.error(error.response?.data?.error || "Erro ao bloquear dia");
      }
    },
  });

  // Mutation para remover dia bloqueado
  const removeDiaBloqueadoMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/diaBloqueado/remove/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bloqueio removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["diasBloqueados"] });
    },
    onError: () => {
      toast.error("Erro ao remover bloqueio");
    },
  });

  // Verificar agendamentos na data
  const verificarAgendamentos = async (date: Date) => {
    try {
      const res = await api.post("/diaBloqueado/verificarAgendamentos", {
        data: dayjs(date).format("YYYY-MM-DD"),
      });
      if (res.data.quantidade > 0) {
        setAgendamentosNoDia(res.data.agendamentos);
        setShowAgendamentosWarning(true);
      } else {
        setAgendamentosNoDia([]);
        setShowAgendamentosWarning(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handlers
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setAgendamentosNoDia([]);
    setShowAgendamentosWarning(false);
    if (date) {
      verificarAgendamentos(date);
    }
  };

  const handleCreateDiaBloqueado = () => {
    if (!selectedDate) {
      toast.error("Selecione uma data");
      return;
    }

    if (showAgendamentosWarning && agendamentosNoDia.length > 0) {
      toast.error("Cancele os agendamentos existentes antes de bloquear o dia");
      return;
    }

    createDiaBloqueadoMutation.mutate({
      data: dayjs(selectedDate).format("YYYY-MM-DD"),
      motivo: motivo.trim() || "",
    });
  };

  const handleRemoveDiaBloqueado = (id: number, dataFormatada: string) => {
    setDeleteModalMessage(
      `Tem certeza que deseja desbloquear o dia ${dataFormatada}?`
    );
    setPendingDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Funções do modal de confirmação
  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      removeDiaBloqueadoMutation.mutate(pendingDeleteId);
    }
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteModalMessage("");
    setPendingDeleteId(null);
  };

  // Dias bloqueados como array de datas (para desabilitar no calendário)
  const diasBloqueadosDatas = diasBloqueados.map((dia) =>
    dayjs(dia.data).format("YYYY-MM-DD")
  );

  return {
    diasBloqueados,
    isLoadingDias,
    selectedDate,
    handleDateSelect,
    motivo,
    setMotivo,
    agendamentosNoDia,
    showAgendamentosWarning,
    diasBloqueadosDatas,
    isCreating: createDiaBloqueadoMutation.isPending,
    isRemoving: removeDiaBloqueadoMutation.isPending,
    handleCreateDiaBloqueado,
    handleRemoveDiaBloqueado,
    // Modal de confirmação
    deleteModalOpen,
    deleteModalMessage,
    confirmDelete,
    closeDeleteModal,
  };
}
