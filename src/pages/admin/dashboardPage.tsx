import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  Clock3,
  FilterX,
  ListOrdered,
} from "lucide-react";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
import LoadingSpinner from "../../components/loading-spinner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import AgendamentoCalendar from "../scheduling/SchedulingCalendar";
import useAdminDashboardPage from "@/hooks/useAdminDashboardPage";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const {
    isLoading,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    totals,
    chartData,
    appointmentsTable,
    quickRanges,
    isQuickRangeActive,
    hasCustomRange,
    dateRangeLabel,
    applyQuickRange,
    clearRange,
    formatAppointmentDateTime,
  } = useAdminDashboardPage();

  const summaryCards = [
    {
      title: "No período",
      value: totals?.range ?? 0,
      description: "Total filtrado",
      icon: CalendarClock,
    },
    {
      title: "Esta semana",
      value: totals?.week ?? 0,
      description: "Últimos 7 dias corridos",
      icon: CalendarDays,
    },
    {
      title: "Este mês",
      value: totals?.month ?? 0,
      description: "Mês atual",
      icon: Clock3,
    },
    {
      title: "Total geral",
      value: totals?.overall ?? 0,
      description: "Histórico completo",
      icon: ListOrdered,
    },
  ];

  return (
    <div className="app-page-bg flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <CalendarClock className="w-6 h-6" />
              Dashboard de Agendamentos
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Acompanhe resultados, ajuste o período e visualize os próximos
              atendimentos
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-neutral-800 rounded-[15px] p-6 min-h-[55vh] flex items-center justify-center">
            <LoadingSpinner message="Carregando dashboard..." size="lg" />
          </div>
        ) : (
          <>
            <Card className="flex flex-col gap-4 p-4 bg-neutral-800 border-white/10">
              <CardHeader className="px-0">
                <CardTitle className="text-[#B8952E]">
                  Filtro de período
                </CardTitle>
                <CardDescription className="text-white/60">
                  Selecione um intervalo rápido ou ajuste as datas manualmente
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <div className="flex flex-wrap items-center gap-2">
                  {quickRanges.map((range) => {
                    const active = isQuickRangeActive(range.days);

                    return (
                      <Button
                        key={range.days}
                        type="button"
                        size="sm"
                        onClick={() => applyQuickRange(range.days)}
                        className={
                          active
                            ? "bg-[#B8952E] text-black hover:bg-[#C9A43B]"
                            : "bg-neutral-900 text-white border border-white/10 hover:bg-neutral-700"
                        }
                      >
                        {range.label}
                      </Button>
                    );
                  })}

                  {hasCustomRange ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={clearRange}
                      className="text-white hover:bg-neutral-700"
                    >
                      <FilterX className="h-4 w-4" /> Resetar para padrão
                    </Button>
                  ) : null}

                  <Badge className="bg-black border border-white/10 text-white/80">
                    Período atual: {dateRangeLabel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Card
                    key={card.title}
                    className="bg-neutral-800 border-white/10 text-white"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardDescription className="text-white/60">
                          {card.title}
                        </CardDescription>
                        <span className="rounded-md border border-[#B8952E]/40 bg-[#B8952E]/10 p-1.5">
                          <Icon className="h-4 w-4 text-[#F2D37A]" />
                        </span>
                      </div>
                      <CardTitle className="text-3xl text-[#B8952E]">
                        {card.value}
                      </CardTitle>
                      <CardDescription className="text-white/50">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AgendamentoCalendar
                title="Data inicial"
                selectedDate={startDate}
                onSelect={(date) => {
                  if (!date) return;
                  setStartDate(date);
                  if (endDate && date > endDate) {
                    setEndDate(date);
                  }
                }}
                disablePastDates={false}
              />
              <AgendamentoCalendar
                title="Data final"
                selectedDate={endDate}
                onSelect={(date) => {
                  if (!date) return;
                  setEndDate(date);
                  if (startDate && date < startDate) {
                    setStartDate(date);
                  }
                }}
                disablePastDates={false}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <ChartAreaInteractive
                data={chartData.map((item) => ({
                  date: item.date,
                  total: item.total,
                }))}
              />

              <Card className="bg-neutral-800 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-[#B8952E]">
                    Próximos agendamentos
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Visão rápida dos próximos horários confirmados
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {appointmentsTable.slice(0, 6).map((appointment) => {
                    return (
                      <div
                        key={appointment.id}
                        className="rounded-lg border border-white/10 bg-black/40 p-3"
                      >
                        <p className="text-sm font-semibold text-white">
                          {appointment.customerName}
                        </p>
                        <p className="mt-1 text-xs text-[#F2D37A]">
                          {formatAppointmentDateTime(
                            appointment.date,
                            appointment.hour,
                          )}
                        </p>
                        <p className="mt-1 text-xs text-white/70 line-clamp-2">
                          {appointment.services.join(", ") ||
                            "Serviço não informado"}
                        </p>
                      </div>
                    );
                  })}

                  {appointmentsTable.length === 0 ? (
                    <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-center text-sm text-white/60">
                      Nenhum agendamento encontrado neste período.
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
