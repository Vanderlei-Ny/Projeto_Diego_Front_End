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
import { useAppTheme } from "@/contexts/AppThemeContext";
import AgendamentoCalendar from "./scheduling/SchedulingCalendar";
import SchedulingDateStrip from "./scheduling/SchedulingDateStrip";
import type { Hour } from "@/types/scheduling/scheduling.types";
import { cn } from "@/lib/utils";

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
  const { isDarkMode } = useAppTheme();
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

  const spinnerTone = isDarkMode ? "dark" : "light";
  const calendarTone = isDarkMode ? "dark" : "light";

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

  const surfaceCard =
    "rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-lg shadow-neutral-950/10 sm:p-5";

  const progressInactive =
    "h-2 flex-1 rounded-full transition-colors bg-[var(--app-border-soft)]";

  const renderHourButton = (hour: Hour, disabled: boolean) => {
    if (disabled) {
      return (
        <button
          key={`busy-${hour.id}`}
          type="button"
          disabled
          className="min-h-[2.75rem] cursor-not-allowed rounded-2xl border border-transparent bg-[var(--app-surface-2)] py-2.5 text-xs font-medium text-[var(--app-text-muted)] line-through decoration-[var(--app-text-muted)] opacity-65 sm:text-sm"
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
        className={cn(
          "min-h-[2.75rem] rounded-2xl border py-2.5 text-xs font-semibold transition-all active:scale-[0.99] sm:text-sm",
          selectedHour === hour.id
            ? "border-[#B8952E] bg-[#B8952E] text-black shadow-md shadow-[#B8952E]/22"
            : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:border-[#B8952E]/45",
        )}
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
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 shrink-0 text-[#B8952E]" aria-hidden />
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--app-text-soft)]">
            {title}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {ordered.map((h) => renderHourButton(h, busyIds.has(h.id)))}
        </div>
      </div>
    );
  };

  const showBookingFooter =
    Boolean(selectedDate) && selectedHour !== null;

  return (
    <div className="app-page-bg flex min-h-[100svh] w-full flex-1 flex-col pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      {isBusy && <LoadingSpinner fullScreen message="Processando..." />}

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-3 pt-4 sm:max-w-2xl sm:px-5 sm:pt-6 md:px-8">
        <div className="flex flex-1 flex-col gap-5">
          <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] transition hover:border-[#B8952E]/45"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-6 w-6 text-[currentColor]" />
          </button>

          <div className="flex flex-1 gap-1.5">
            <div
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                selectedDate ? "bg-[#B8952E]" : progressInactive,
              )}
            />
            <div
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                selectedHour !== null ? "bg-[#B8952E]" : progressInactive,
              )}
            />
            <div
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                selectedServices.length > 0 ? "bg-[#B8952E]" : progressInactive,
              )}
            />
          </div>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-soft)] transition hover:border-[#B8952E]/45 hover:text-[var(--app-text)]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-1.5 px-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8952E]">
            {stepSubtitle}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
            Monte seu <span className="text-[#F2D37A]">agendamento</span>
          </h1>
        </div>

        <section className={surfaceCard}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate text-lg font-semibold capitalize leading-tight text-[var(--app-text)]">
              {monthHeading}
            </p>
            <AgendamentoCalendar
              showContainer={false}
              showSelectedSummary={false}
              title=""
              monthPickerVariant="icon"
              calendarTone={calendarTone}
              mobileCalendarCentered
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              activeWeekdays={activeWeekdays}
              diasBloqueados={diasBloqueados}
              isCalendarDataReady={isCalendarDataReady}
            />
          </div>

          {!isCalendarDataReady ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner
                message="Carregando datas..."
                size="sm"
                tone={spinnerTone}
              />
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
          <section className={surfaceCard}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--app-text)]">
              <Clock className="h-5 w-5 text-[#B8952E]" aria-hidden />
              Horários
            </h2>

            {isVerifyingDay ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner
                  message="Carregando horários..."
                  size="sm"
                  tone={spinnerTone}
                />
              </div>
            ) : !dayData ? (
              <p className="text-sm text-[var(--app-text-muted)]">
                Selecione uma data válida para carregar os horários.
              </p>
            ) : hoursDisponible.length === 0 && hoursAgendados.length === 0 ? (
              <p className="text-center text-sm text-[var(--app-text-muted)]">
                Nenhum horário configurado para este dia.
              </p>
            ) : hoursDisponible.length === 0 && hoursAgendados.length > 0 ? (
              <div
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border px-4 py-8 text-center",
                  isDarkMode
                    ? "border-red-500/35 bg-red-500/15"
                    : "border-red-200 bg-red-50",
                )}
              >
                <AlertCircle
                  className={cn(
                    "h-8 w-8",
                    isDarkMode ? "text-red-400" : "text-red-500",
                  )}
                  aria-hidden
                />
                <p
                  className={cn(
                    "font-semibold",
                    isDarkMode ? "text-red-200" : "text-red-800",
                  )}
                >
                  Todos os horários estão agendados
                </p>
                <p className="text-sm text-[var(--app-text-muted)]">
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
          <section className={surfaceCard}>
            <h2 className="mb-4 text-lg font-bold text-[var(--app-text)]">
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
                    className={cn(
                      "flex min-h-[4.25rem] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-all active:scale-[0.99]",
                      on
                        ? "border-[#B8952E] bg-[#B8952E]/14 text-[var(--app-text)] shadow-md shadow-neutral-950/15"
                        : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:border-[#B8952E]/45",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold leading-snug">
                        {service.name}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-sm font-medium",
                          on ? "text-[#F2D37A]" : "text-[var(--app-text-muted)]",
                        )}
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
                        className="inline-block h-6 w-6 shrink-0 rounded-full border border-[var(--app-border)]"
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

        {showBookingFooter && (
          <div
            className="sticky bottom-0 z-20 mt-auto shrink-0 space-y-3 border-t border-[var(--app-border)] bg-[var(--app-bg)]/95 pb-3 pt-3 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--app-bg)]/88"
            style={{ WebkitBackdropFilter: "blur(12px)" }}
          >
            <div className="rounded-2xl border border-[#B8952E]/35 bg-[var(--app-card)] p-4 shadow-lg shadow-neutral-950/15">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8952E]/90">
                Resumo
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  {selectedServiceDetails.length > 0 ? (
                    <ul className="max-h-[7.5rem] space-y-1 overflow-y-auto overscroll-contain pr-1 text-sm font-semibold leading-snug text-[var(--app-text)] sm:max-h-[9rem]">
                      {selectedServiceDetails.map((s) => (
                        <li
                          key={s.id}
                          className="break-words text-[var(--app-text)]"
                        >
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm font-semibold text-[var(--app-text-muted)]">
                      Nenhum serviço selecionado
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--app-text-muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#B8952E]" />
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
                  <p className="shrink-0 text-right text-lg font-bold text-[#F2D37A] sm:pt-0.5">
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
              className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-[#B8952E] py-3.5 text-base font-bold text-black shadow-lg shadow-[#B8952E]/22 transition hover:bg-[#d4af37] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Confirmar agendamento
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
            <p className="text-center text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
              Pagamento no dia do atendimento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedulingPage;
