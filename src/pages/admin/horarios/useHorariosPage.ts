import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../http/api";
import useAuth from "../../../hooks/useAuth";

interface Hour {
  id: number;
  hourDisponible: string;
}

interface DayWithHours {
  id: number;
  diaDaSemana: string;
  falseOrTrue: boolean;
  hours: Hour[];
}

type DiaDaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

// Função para formatar horário enquanto digita
export function formatHourInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 4 dígitos
  const limited = numbers.slice(0, 4);

  // Formata como HH:MM
  if (limited.length <= 2) {
    return limited;
  }

  const hours = limited.slice(0, 2);
  const minutes = limited.slice(2, 4);

  // Validação básica
  const hoursNum = parseInt(hours, 10);
  const minutesNum = parseInt(minutes, 10);

  // Se as horas forem maiores que 23, ajusta
  const validHours = hoursNum > 23 ? "23" : hours;
  // Se os minutos forem maiores que 59, ajusta
  const validMinutes = minutesNum > 59 ? "59" : minutes;

  return `${validHours}:${validMinutes}`;
}

// Validar se o horário está completo e válido
export function isValidHour(value: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
}

export default function useHorariosPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Estados
  const [selectedDayToManage, setSelectedDayToManage] = useState<number | null>(
    null
  );
  const [newHourInput, setNewHourInput] = useState("");
  const [showAddDayForm, setShowAddDayForm] = useState(false);
  const [newDayName, setNewDayName] = useState<DiaDaSemana | "">("");

  // Buscar todos os dias e horários
  const { data: allDaysAndHoursRaw = [], isLoading: isLoadingDays } = useQuery({
    queryKey: ["allDaysAndHours"],
    queryFn: async () => {
      const res = await api.get("/dayAndHours/listAll");
      return res.data as DayWithHours[];
    },
    enabled: isAdmin,
  });

  // Ordenar dias da semana na ordem correta
  const dayOrder: Record<string, number> = {
    DOMINGO: 0,
    SEGUNDA: 1,
    TERCA: 2,
    QUARTA: 3,
    QUINTA: 4,
    SEXTA: 5,
    SABADO: 6,
  };

  const allDaysAndHours = [...allDaysAndHoursRaw].sort(
    (a, b) => dayOrder[a.diaDaSemana] - dayOrder[b.diaDaSemana]
  );

  // Mutation para adicionar horário
  const addHourMutation = useMutation({
    mutationFn: async (data: { dayId: number; hour: string }) => {
      const res = await api.post("/dayAndHours/addHour", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Horário adicionado!");
      queryClient.invalidateQueries({ queryKey: ["allDaysAndHours"] });
      queryClient.invalidateQueries({ queryKey: ["activeDays"] });
      setNewHourInput("");
    },
  });

  // Mutation para remover horário
  const removeHourMutation = useMutation({
    mutationFn: async (hourId: number) => {
      const res = await api.delete(`/dayAndHours/removeHour/${hourId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Horário removido!");
      queryClient.invalidateQueries({ queryKey: ["allDaysAndHours"] });
      queryClient.invalidateQueries({ queryKey: ["activeDays"] });
    },
  });

  // Mutation para ativar/desativar dia
  const toggleDayMutation = useMutation({
    mutationFn: async (dayId: number) => {
      const res = await api.patch(`/dayAndHours/toggleDay/${dayId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allDaysAndHours"] });
      queryClient.invalidateQueries({ queryKey: ["activeDays"] });
    },
  });

  // Mutation para criar novo dia (sem horários obrigatórios)
  const createDayMutation = useMutation({
    mutationFn: async (data: { diaDaSemana: string }) => {
      const res = await api.post("/dayAndHours/createDay", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Dia criado!");
      queryClient.invalidateQueries({ queryKey: ["allDaysAndHours"] });
      queryClient.invalidateQueries({ queryKey: ["activeDays"] });
      setShowAddDayForm(false);
      setNewDayName("");
    },
  });

  // Mutation para remover dia
  const removeDayMutation = useMutation({
    mutationFn: async (dayId: number) => {
      const res = await api.delete(`/dayAndHours/removeDay/${dayId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Dia removido!");
      queryClient.invalidateQueries({ queryKey: ["allDaysAndHours"] });
      queryClient.invalidateQueries({ queryKey: ["activeDays"] });
      setSelectedDayToManage(null);
    },
  });

  // Handlers
  const handleHourInputChange = (value: string) => {
    setNewHourInput(formatHourInput(value));
  };

  const handleAddHour = () => {
    if (!selectedDayToManage || !newHourInput.trim()) {
      toast.error("Selecione um dia e digite o horário");
      return;
    }

    if (!isValidHour(newHourInput.trim())) {
      toast.error("Formato inválido. Use HH:MM (ex: 09:00)");
      return;
    }

    addHourMutation.mutate({
      dayId: selectedDayToManage,
      hour: newHourInput.trim(),
    });
  };

  const handleRemoveHour = (hourId: number) => {
    if (confirm("Tem certeza que deseja remover este horário?")) {
      removeHourMutation.mutate(hourId);
    }
  };

  const handleToggleDay = (dayId: number) => {
    toggleDayMutation.mutate(dayId);
  };

  const handleCreateDay = () => {
    if (!newDayName) {
      toast.error("Selecione o dia da semana");
      return;
    }

    createDayMutation.mutate({
      diaDaSemana: newDayName,
    });
  };

  const handleRemoveDay = (dayId: number) => {
    if (
      confirm(
        "Tem certeza que deseja remover este dia e todos os seus horários?"
      )
    ) {
      removeDayMutation.mutate(dayId);
    }
  };

  // Dias da semana disponíveis para adicionar
  const existingDays = allDaysAndHours.map((d) => d.diaDaSemana);
  const availableDaysToAdd: DiaDaSemana[] = (
    [
      "DOMINGO",
      "SEGUNDA",
      "TERCA",
      "QUARTA",
      "QUINTA",
      "SEXTA",
      "SABADO",
    ] as DiaDaSemana[]
  ).filter((day) => !existingDays.includes(day));

  return {
    allDaysAndHours,
    isLoadingDays,
    selectedDayToManage,
    setSelectedDayToManage,
    newHourInput,
    handleHourInputChange,
    showAddDayForm,
    setShowAddDayForm,
    newDayName,
    setNewDayName,
    availableDaysToAdd,
    isAddingHour: addHourMutation.isPending,
    isRemovingHour: removeHourMutation.isPending,
    isTogglingDay: toggleDayMutation.isPending,
    isCreatingDay: createDayMutation.isPending,
    isRemovingDay: removeDayMutation.isPending,
    handleAddHour,
    handleRemoveHour,
    handleToggleDay,
    handleCreateDay,
    handleRemoveDay,
  };
}
