import type { ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ban,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Clock3,
  FilterX,
  LayoutDashboard,
  ListOrdered,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
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

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: ComponentType<{ className?: string }>;
  highlight?: boolean;
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  highlight,
}: StatCardProps) {
  return (
    <Card
      className={`border-white/10 text-white ${
        highlight
          ? "bg-gradient-to-br from-[#B8952E]/25 to-neutral-900"
          : "bg-neutral-800"
      }`}
    >
      <CardHeader className="space-y-0 pb-2 pt-4 px-4 sm:px-5">
        <div className="flex items-start justify-between gap-2">
          <CardDescription className="text-white/65 text-xs sm:text-sm font-medium leading-tight">
            {title}
          </CardDescription>
          <span className="shrink-0 rounded-lg border border-[#B8952E]/35 bg-[#B8952E]/10 p-1.5">
            <Icon className="h-4 w-4 text-[#F2D37A]" />
          </span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-[#B8952E] tabular-nums">
          {value}
        </CardTitle>
        <p className="text-[11px] sm:text-xs text-white/50 pt-1">{description}</p>
      </CardHeader>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const {
    isLoading,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    totals,
    kpis,
    revenue,
    topServicesInRange,
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

  return (
    <div className="app-page-bg flex min-h-screen w-full flex-col px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        {/* Cabeçalho — mesmo padrão das outras telas admin */}
        <div className="flex flex-col gap-4 rounded-[15px] bg-neutral-800 p-4 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-xl font-bold text-[#B8952E] sm:text-2xl">
              <LayoutDashboard className="h-6 w-6 shrink-0" />
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Visão geral da barbearia: agendamentos, clientes e receita estimada
              no período.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Agendamentos
              </Link>
              <Link
                to="/admin/servicos"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                <Scissors className="h-3.5 w-3.5" />
                Serviços
              </Link>
              <Link
                to="/admin/usuarios"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                <Users className="h-3.5 w-3.5" />
                Clientes
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start md:self-center">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 rounded-lg bg-[#B8952E] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#d4af37] md:px-3"
              aria-label="Voltar ao painel de agendamentos"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-[15px] bg-neutral-800 p-6">
            <LoadingSpinner message="Carregando dashboard..." size="lg" />
          </div>
        ) : (
          <>
            {/* Filtro de período */}
            <Card className="border-white/10 bg-neutral-800">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-[#B8952E] sm:text-lg">
                  <CalendarRange className="h-5 w-5" />
                  Período do relatório
                </CardTitle>
                <CardDescription className="text-white/60">
                  Atalhos rápidos ou datas personalizadas abaixo. A receita e o
                  gráfico usam o intervalo selecionado.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="flex flex-wrap gap-2">
                  {quickRanges.map((range) => (
                    <Button
                      key={range.days}
                      type="button"
                      size="sm"
                      onClick={() => applyQuickRange(range.days)}
                      className={
                        isQuickRangeActive(range.days)
                          ? "bg-[#B8952E] text-black hover:bg-[#C9A43B]"
                          : "border border-white/10 bg-neutral-900 text-white hover:bg-neutral-700"
                      }
                    >
                      {range.label}
                    </Button>
                  ))}
                  {hasCustomRange ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={clearRange}
                      className="text-white hover:bg-neutral-700"
                    >
                      <FilterX className="mr-1 h-4 w-4" />
                      Padrão
                    </Button>
                  ) : null}
                </div>
                <Badge className="w-fit border border-white/10 bg-black/50 text-white/85">
                  {dateRangeLabel}
                </Badge>
              </CardContent>
            </Card>

            {/* Destaques — grid responsivo */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard
                title="Hoje"
                value={kpis.appointmentsToday}
                description="Atendimentos confirmados para hoje"
                icon={Sparkles}
                highlight
              />
              <StatCard
                title="Amanhã"
                value={kpis.appointmentsTomorrow}
                description="Já reservados para amanhã"
                icon={Clock3}
              />
              <StatCard
                title="No período"
                value={totals?.range ?? 0}
                description="Agendamentos dentro do filtro atual"
                icon={CalendarClock}
              />
              <StatCard
                title="Receita estimada"
                value={money(revenue.estimatedInRange)}
                description="Soma dos serviços no período (valores cadastrados)"
                icon={Wallet}
                highlight
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
              <StatCard
                title="Esta semana"
                value={totals?.week ?? 0}
                description="Da data de hoje até o fim da semana"
                icon={CalendarDays}
              />
              <StatCard
                title="Este mês"
                value={totals?.month ?? 0}
                description="Da data de hoje até o fim do mês"
                icon={TrendingUp}
              />
              <StatCard
                title="Futuros (total)"
                value={totals?.overall ?? 0}
                description="Todos os agend. a partir de hoje"
                icon={ListOrdered}
              />
              <StatCard
                title="Clientes"
                value={kpis.clientsTotal}
                description="Usuários com perfil cliente"
                icon={Users}
              />
              <StatCard
                title="Serviços"
                value={kpis.servicesTotal}
                description="Itens cadastrados na barbearia"
                icon={Scissors}
              />
              <StatCard
                title="Dias bloqueados"
                value={kpis.blockedDaysAhead}
                description="Folgas/feriados a partir de hoje"
                icon={Ban}
              />
            </div>

            {/* Calendários — empilhados no mobile */}
            <Card className="border-white/10 bg-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#B8952E] sm:text-lg">
                  Personalizar datas
                </CardTitle>
                <CardDescription className="text-white/60">
                  Ajuste início e fim do intervalo exibido no gráfico e nas
                  tabelas.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <AgendamentoCalendar
                  title="Data inicial"
                  selectedDate={startDate}
                  onSelect={(date) => {
                    if (!date) return;
                    setStartDate(date);
                    if (endDate && date > endDate) setEndDate(date);
                  }}
                  disablePastDates={false}
                />
                <AgendamentoCalendar
                  title="Data final"
                  selectedDate={endDate}
                  onSelect={(date) => {
                    if (!date) return;
                    setEndDate(date);
                    if (startDate && date < startDate) setStartDate(date);
                  }}
                  disablePastDates={false}
                />
              </CardContent>
            </Card>

            {/* Gráfico + ranking + próximos */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="min-h-[280px] xl:col-span-2">
                <ChartAreaInteractive
                  data={chartData.map((item) => ({
                    date: item.date,
                    total: item.total,
                  }))}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Card className="border-white/10 bg-neutral-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#B8952E]">
                      Serviços no período
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Mais agendados no filtro atual
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topServicesInRange.length === 0 ? (
                      <p className="rounded-lg border border-white/10 bg-black/30 p-3 text-center text-sm text-white/55">
                        Nenhum serviço neste período.
                      </p>
                    ) : (
                      topServicesInRange.map((s, i) => (
                        <div
                          key={s.name}
                          className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-sm"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8952E]/20 text-xs font-bold text-[#F2D37A]">
                              {i + 1}
                            </span>
                            <span className="truncate font-medium">{s.name}</span>
                          </span>
                          <Badge
                            variant="secondary"
                            className="shrink-0 border-white/10 bg-neutral-900 text-white/90"
                          >
                            {s.count}×
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="max-h-[420px] border-white/10 bg-neutral-800 text-white overflow-hidden flex flex-col">
                  <CardHeader className="shrink-0 pb-2">
                    <CardTitle className="text-[#B8952E]">
                      Próximos no período
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Até {Math.min(appointmentsTable.length, 8)} itens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                    {appointmentsTable.length === 0 ? (
                      <p className="rounded-lg border border-white/10 bg-black/30 p-4 text-center text-sm text-white/55">
                        Nenhum agendamento neste período.
                      </p>
                    ) : (
                      appointmentsTable.slice(0, 8).map((a) => (
                        <div
                          key={a.id}
                          className="rounded-lg border border-white/10 bg-black/40 p-3"
                        >
                          <p className="text-sm font-semibold text-white">
                            {a.customerName}
                          </p>
                          <p className="mt-1 text-xs text-[#F2D37A]">
                            {formatAppointmentDateTime(a.date, a.hour)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-white/65">
                            {a.services.length
                              ? a.services.join(", ")
                              : "Serviço não informado"}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
