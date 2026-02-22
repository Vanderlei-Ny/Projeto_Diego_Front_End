import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAgendamento from "../../hooks/useAgendamento";
import api from "@/http/api";

export default function useAgendamentoPage() {
  const navigate = useNavigate();
  const {
    services,
    loadingServices,
    verifyDay,
    createAgendamento,
    isVerifyingDay,
    isCreatingAgendamento,
    dayData,
    resetDayData,
    diasBloqueados,
  } = useAgendamento();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [activeWeekdays, setActiveWeekdays] = useState<string[]>([]);

  const isBusy = isVerifyingDay || isCreatingAgendamento;

  // Carrega dias de funcionamento da barbearia
  useEffect(() => {
    let mounted = true;
    api
      .get("/agendamento/activeDays")
      .then((res) => {
        if (!mounted) return;
        const days = Array.isArray(res.data?.activeDays)
          ? res.data.activeDays
          : [];
        setActiveWeekdays(days);
      })
      .catch((err) => {
        console.error("Erro ao carregar dias ativos", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const normalizedServices = useMemo(() => {
    if (!services || !Array.isArray(services)) return [];
    return services.map((s, index) => ({
      ...s,
      id: Number(s.id),
      __key: `svc-${index}`,
    }));
  }, [services]);

  const normalizedDisponibleHours = useMemo(() => {
    const hours = dayData?.hoursDisponible;
    if (!hours || !Array.isArray(hours)) return [];
    return hours.map((h, index) => ({
      ...h,
      id: Number(h.id),
      __key: `hd-${index}`,
    }));
  }, [dayData?.hoursDisponible]);

  const normalizedAgendadosHours = useMemo(() => {
    const hours = dayData?.hoursAgendados;
    if (!hours || !Array.isArray(hours)) return [];
    return hours.map((h, index) => ({
      ...h,
      id: Number(h.id),
      __key: `ha-${index}`,
    }));
  }, [dayData?.hoursAgendados]);

  const handleDateSelect = useCallback(
    async (date: Date | undefined) => {
      if (!date) return;
      setSelectedDate(date);
      setSelectedHour(null);
      setSelectedServices([]);
      resetDayData();

      try {
        // Converte para string no formato local (YYYY-MM-DD) sem usar timezone UTC
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;
        await verifyDay(dateString);
      } catch (error) {
        console.error("Erro ao verificar dia:", error);
      }
    },
    [resetDayData, verifyDay]
  );

  const handleServiceToggle = useCallback((serviceId: number) => {
    const id = Number(serviceId);
    if (isNaN(id)) return;

    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleHourSelect = useCallback((hourId: number) => {
    const id = Number(hourId);
    if (isNaN(id)) return;
    setSelectedHour(id);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (
      !selectedDate ||
      !selectedHour ||
      selectedServices.length === 0 ||
      !dayData?.dayId
    ) {
      toast.error("Preencha todos os campos antes de agendar.");
      return;
    }

    try {
      // Converte para string no formato local (YYYY-MM-DD) sem usar timezone UTC
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      await createAgendamento({
        data: dateString,
        dayId: dayData.dayId,
        hourId: selectedHour,
        services: selectedServices,
      });

      toast.success("Agendamento realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    }
  }, [
    createAgendamento,
    dayData?.dayId,
    navigate,
    selectedDate,
    selectedHour,
    selectedServices,
  ]);

  const handleGoHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return {
    // data
    services: normalizedServices,
    hoursDisponible: normalizedDisponibleHours,
    hoursAgendados: normalizedAgendadosHours,
    loadingServices,
    dayData,
    isBusy,
    isVerifyingDay,
    activeWeekdays,
    diasBloqueados,

    // state
    selectedDate,
    selectedHour,
    selectedServices,

    // setters / actions
    handleDateSelect,
    handleServiceToggle,
    handleHourSelect,
    handleSubmit,
    handleGoHome,
  };
}
