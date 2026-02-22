import { useMemo, useState } from "react";
import { CalendarRange, ChevronLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../../http/api";
import LoadingSpinner from "../../components/loading-spinner";

dayjs.locale("pt-br");

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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["admin-agendamentos"],
    queryFn: async () => {
      const res = await api.get("/agendamento/admin/listAll");
      return res.data as Agendamento[];
    },
  });

  const rangeFiltered = useMemo(() => {
    if (!startDate && !endDate) return agendamentos;

    const start = startDate ? dayjs(startDate).startOf("day") : null;
    const end = endDate ? dayjs(endDate).endOf("day") : null;

    return agendamentos.filter((ag) => {
      const date = dayjs(ag.dataOriginal);
      if (start && date.isBefore(start)) return false;
      if (end && date.isAfter(end)) return false;
      return true;
    });
  }, [agendamentos, startDate, endDate]);

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    rangeFiltered.forEach((ag) => {
      const key = ag.dataAgendamento;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const dateA = dayjs(a[0], "DD/MM/YYYY");
      const dateB = dayjs(b[0], "DD/MM/YYYY");
      return dateA.valueOf() - dateB.valueOf();
    });
  }, [rangeFiltered]);

  const last7DaysCounts = useMemo(() => {
    const end = dayjs().endOf("day");
    const start = dayjs().subtract(6, "day").startOf("day");
    const map = new Map<string, number>();

    agendamentos.forEach((ag) => {
      const date = dayjs(ag.dataOriginal);
      if (date.isBefore(start) || date.isAfter(end)) return;
      const key = date.format("DD/MM/YYYY");
      map.set(key, (map.get(key) || 0) + 1);
    });

    const result: Array<[string, number]> = [];
    for (let i = 0; i < 7; i += 1) {
      const day = start.add(i, "day").format("DD/MM/YYYY");
      result.push([day, map.get(day) || 0]);
    }
    return result;
  }, [agendamentos]);

  const totalAgendamentos = agendamentos.length;
  const totalRange = rangeFiltered.length;

  return (
    <div className="flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 bg-black flex-col">
      {isLoading && <LoadingSpinner fullScreen message="Carregando..." />}

      <div className="flex w-full max-w-7xl mx-auto flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Dashboard de Agendamentos
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Veja a quantidade de agendamentos por data
            </p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
            <CalendarRange className="w-5 h-5" /> Filtrar por período
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Data inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E]"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Data final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E]"
              />
            </div>
          </div>
          <div className="mt-4 text-white/70 text-sm">
            {startDate || endDate ? (
              <span>
                Total no período: <strong>{totalRange}</strong>
              </span>
            ) : (
              <span>
                Total geral: <strong>{totalAgendamentos}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Últimos 7 dias */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4">
            Últimos 7 dias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {last7DaysCounts.map(([date, count]) => (
              <div
                key={date}
                className="bg-black rounded-lg border border-white/10 p-3 text-center"
              >
                <p className="text-white/70 text-xs">{date}</p>
                <p className="text-[#B8952E] text-xl font-bold">{count}</p>
                <p className="text-white/50 text-xs">agendamentos</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lista por data */}
        <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <h2 className="text-lg font-semibold text-[#B8952E] mb-4">
            Agendamentos por data
          </h2>
          {countsByDate.length === 0 ? (
            <p className="text-white/60">
              Nenhum agendamento encontrado no período selecionado.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {countsByDate.map(([date, count]) => (
                <div
                  key={date}
                  className="bg-black rounded-lg border border-white/10 p-4 flex items-center justify-between"
                >
                  <span className="text-white font-medium">{date}</span>
                  <span className="text-[#B8952E] font-semibold">
                    {count} agendamento{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
