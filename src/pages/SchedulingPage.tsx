import { useMemo } from "react";
import LoadingSpinner from "../components/loading-spinner";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  Sun,
  Sunrise,
  X,
} from "lucide-react";
import useSchedulingPage from "../hooks/useSchedulingPage";
import AgendamentoCalendar from "./scheduling/SchedulingCalendar";
import SchedulingDateStrip from "./scheduling/SchedulingDateStrip";
import type { Hour } from "@/types/scheduling/scheduling.types";

const NOON_MINUTES = 12 * 60;

function minutesFromHourLabel(label: string): number | null {
  const t = label.trim();
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(mm) || h > 23 || mm > 59) {
    return null;
  }
  return h * 60 + mm;
}

function partitionHoursByTimeOfDay(hours: Hour[]) {
  const morning: Hour[] = [];
  const afternoon: Hour[] = [];

  for (const h of hours) {
    const mins = minutesFromHourLabel(h.availableHour);
    if (mins === null || mins < NOON_MINUTES) morning.push(h);
    else afternoon.push(h);
  }

  return { morning, afternoon };
}

function sortHoursChrono(hours: Hour[]) {
  return [...hours].sort((a, b) => {
    const ma = minutesFromHourLabel(a.availableHour);
    const mb = minutesFromHourLabel(b.availableHour);
    const na = ma ?? 0;
    const nb = mb ?? 0;
    return na - nb;
  });
}

function parseServiceValue(value: string): number {
  const n = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function SchedulingPage() {
  const {
    services,
    hoursDisponible,
    hoursAgendados,
    dayData,
    isBusy,
    isVerifyingDay,
    selectedDate,
    selectedHour,
    selectedServices,
    activeWeekdays,
    diasBloqueados,
    isCalendarDataReady,
    handleDateSelect,
    handleServiceToggle,
    handleHourSelect,
    handleSubmit,
    handleGoHome,
  } = useSchedulingPage();

  const { morning: busyMorning, afternoon: busyAfternoon } = useMemo(
    () => partitionHoursByTimeOfDay(hoursAgendados),
    [hoursAgendados],
  );
  const { morning: freeMorning, afternoon: freeAfternoon } = useMemo(
    () => partitionHoursByTimeOfDay(hoursDisponible),
    [hoursDisponible],
  );

  const selectedHourLabel = useMemo(() => {
    if (selectedHour === null) return null;
    const all = [...hoursDisponible, ...hoursAgendados];
    return all.find((h) => h.id === selectedHour)?.availableHour ?? null;
  }, [selectedHour, hoursDisponible, hoursAgendados]);

  const selectedServiceDetails = useMemo(
    () => services.filter((s) => selectedServices.includes(s.id)),
    [services, selectedServices],
  );

  const totalSelected = useMemo(
    () =>
      selectedServiceDetails.reduce(
        (acc, s) => acc + parseServiceValue(s.value),
        0,
      ),
    [selectedServiceDetails],
  );

  const monthHeading = useMemo(() => {
    const ref = selectedDate ?? new Date();
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(ref);
  }, [selectedDate]);

  const stepSubtitle = !selectedDate
    ? "Passo 1 de 3 · data"
    : selectedHour === null
      ? "Passo 2 de 3 · horário"
      : "Passo 3 de 3 · serviços";

  const renderHourButton = (hour: Hour, disabled: boolean) => {
    if (disabled) {
      return (
        <button
          key={`busy-${hour.id}`}
          type="button"
          disabled
          className="min-h-[2.75rem] cursor-not-allowed rounded-2xl border border-transparent bg-white/[0.04] py-2.5 text-xs font-medium text-white/25 sm:text-sm"
        >
          {hour.availableHour}
        </button>
      );
    }

    return (
      <button
        key={`free-${hour.id}`}
        type="button"
        onClick={() => handleHourSelect(hour.id)}
        className={`min-h-[2.75rem] rounded-2xl border py-2.5 text-xs font-semibold transition-all active:scale-[0.99] sm:text-sm ${
          selectedHour === hour.id
            ? "border-[#B8952E] bg-[#B8952E] text-black shadow-md shadow-black/25"
            : "border-white/12 bg-neutral-900/80 text-white hover:border-[#B8952E]/45"
        }`}
      >
        {hour.availableHour}
      </button>
    );
  };

  const renderSlotSection = (
    title: string,
    Icon: typeof Sun,
    free: Hour[],
    busy: Hour[],
  ) => {
    if (free.length === 0 && busy.length === 0) return null;

    const busyIds = new Set(busy.map((b) => b.id));
    const ordered = sortHoursChrono([...free, ...busy]);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#F2D37A]/90">
          <Icon className="h-5 w-5 text-[#B8952E]" aria-hidden />
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#F2D37A]/80">
            {title}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {ordered.map((h) =>
            renderHourButton(h, busyIds.has(h.id)),
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-page-bg relative flex min-h-screen w-full flex-col px-3 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pb-28 sm:pt-6 md:px-8">
      {isBusy && <LoadingSpinner fullScreen message="Processando..." />}

      <div className="mx-auto flex w-full max-w-lg flex-col gap-5 sm:max-w-2xl">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-white transition hover:border-[#B8952E]/35"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-1.5">
            <div
              className={`h-2 flex-1 rounded-full transition-colors ${selectedDate ? "bg-[#B8952E]" : "bg-white/15"}`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-colors ${selectedHour !== null ? "bg-[#B8952E]" : "bg-white/15"}`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-colors ${selectedServices.length > 0 ? "bg-[#B8952E]" : "bg-white/15"}`}
            />
          </div>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-white/80 transition hover:border-[#B8952E]/35 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-1.5 px-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8952E]/90">
            {stepSubtitle}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Monte seu{" "}
            <span className="text-[#F2D37A]">agendamento</span>
          </h1>
        </div>

        <section className="rounded-[1.35rem] border border-white/10 bg-neutral-800/95 p-4 shadow-xl shadow-black/30 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate text-lg font-semibold capitalize leading-tight text-white">
              {monthHeading}
            </p>
            <AgendamentoCalendar
              showContainer={false}
              showSelectedSummary={false}
              title=""
              monthPickerVariant="icon"
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              activeWeekdays={activeWeekdays}
              diasBloqueados={diasBloqueados}
              isCalendarDataReady={isCalendarDataReady}
            />
          </div>

          {!isCalendarDataReady ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner message="Carregando datas..." size="sm" />
            </div>
          ) : (
            <SchedulingDateStrip
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              activeWeekdays={activeWeekdays}
              diasBloqueados={diasBloqueados}
              isCalendarDataReady={isCalendarDataReady}
            />
          )}
        </section>

        {selectedDate && (
          <section className="rounded-[1.35rem] border border-white/10 bg-neutral-800/95 p-4 shadow-xl shadow-black/30 sm:p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#F2D37A]">
              <Clock className="h-5 w-5 text-[#B8952E]" aria-hidden />
              Horários
            </h2>

            {isVerifyingDay ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner message="Carregando horários..." size="sm" />
              </div>
            ) : !dayData ? (
              <p className="text-sm text-white/55">
                Selecione uma data válida para carregar os horários.
              </p>
            ) : hoursDisponible.length === 0 && hoursAgendados.length === 0 ? (
              <p className="text-center text-sm text-white/55">
                Nenhum horário configurado para este dia.
              </p>
            ) : hoursDisponible.length === 0 && hoursAgendados.length > 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-8 text-center">
                <AlertCircle
                  className="h-8 w-8 text-red-400"
                  aria-hidden
                />
                <p className="font-semibold text-red-300">
                  Todos os horários estão agendados
                </p>
                <p className="text-sm text-white/70">
                  Escolha outro dia na faixa acima.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {renderSlotSection(
                  "Manhã",
                  Sunrise,
                  freeMorning,
                  busyMorning,
                )}
                {renderSlotSection(
                  "Tarde",
                  Sun,
                  freeAfternoon,
                  busyAfternoon,
                )}
              </div>
            )}
          </section>
        )}

        {selectedDate && selectedHour !== null && (
          <section className="rounded-[1.35rem] border border-white/10 bg-neutral-800/95 p-4 shadow-xl shadow-black/30 sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-[#F2D37A]">
              Serviços
            </h2>
            <div className="custom-scrollbar max-h-[min(24rem,50vh)] space-y-3 overflow-y-auto pr-1 sm:max-h-[min(28rem,45vh)]">
              {services.map((service) => {
                const on = selectedServices.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`flex min-h-[4.25rem] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-all active:scale-[0.99] ${
                      on
                        ? "border-[#B8952E] bg-[#B8952E]/15 text-white shadow-md shadow-black/20"
                        : "border-white/10 bg-black/40 text-white hover:border-[#B8952E]/40"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold leading-snug">
                        {service.name}
                      </p>
                      <p
                        className={`mt-1 text-sm font-medium ${on ? "text-[#F2D37A]/90" : "text-white/50"}`}
                      >
                        R$ {service.value}
                      </p>
                    </div>
                    {on ? (
                      <Check
                        className="h-6 w-6 shrink-0 text-[#B8952E]"
                        aria-hidden
                      />
                    ) : (
                      <span
                        className="inline-block h-6 w-6 shrink-0 rounded-full border border-white/15"
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {selectedDate && selectedHour !== null && (
        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[var(--app-bg)]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:px-6"
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="mx-auto w-full max-w-lg sm:max-w-2xl">
            <div className="mb-3 rounded-2xl border border-[#B8952E]/25 bg-neutral-900/90 p-4 shadow-lg shadow-black/35">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8952E]/80">
                Resumo
              </p>
              <div className="mt-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {selectedServiceDetails.length > 0
                      ? selectedServiceDetails.map((s) => s.name).join(", ")
                      : "Nenhum serviço selecionado"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#B8952E]" />
                      {selectedHourLabel ?? "—"}
                    </span>
                    {selectedDate && (
                      <span>
                        {selectedDate.toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>
                {selectedServiceDetails.length > 0 && (
                  <p className="shrink-0 text-lg font-bold text-[#F2D37A]">
                    R${" "}
                    {totalSelected.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                selectedServices.length === 0 || !selectedHour || isBusy
              }
              className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-[#B8952E] py-3.5 text-base font-bold text-black shadow-lg shadow-[#B8952E]/25 transition hover:bg-[#d4af37] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Confirmar agendamento
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
            <p className="mt-2.5 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
              Pagamento no dia do atendimento
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulingPage;
