import { useEffect, useState } from "react";
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
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAgendamentos(userId?: number | null) {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/agendamento/listAgendamentoOfUser/${userId}`);
      const data = res.data;

      setAgendamentos(
        Array.isArray(data)
          ? data.map((item: any, index: number) => ({
              id: item.id ?? index,
              dataAgendamento: item.dataAgendamento,
              hour: item.hour.hourDisponible,
              nameServices: item.service.map((s: any) => s.nameService),
            }))
          : []
      );
    } catch (err: any) {
      setError(err?.message ?? "Erro ao buscar agendamentos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgendamentos(user?.userId ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  async function deleteAgendamento(agendamentoId: number) {
    try {
      await api.delete(`/agendamento/deleteAgendamento/${agendamentoId}`);
      setAgendamentos((prev) => prev.filter((a) => a.id !== agendamentoId));
    } catch (err: any) {
      setError(err?.message ?? "Erro ao deletar agendamento");
      throw err;
    }
  }

  return {
    agendamentos,
    loading,
    error,
    fetchAgendamentos,
    deleteAgendamento,
  };
}
