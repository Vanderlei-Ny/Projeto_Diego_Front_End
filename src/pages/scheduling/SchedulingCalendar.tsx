import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { AgendamentoCalendarProps } from "@/types/components/component-props.types";
import { cn } from "@/lib/utils";
import { isBookingDateDisabled } from "./booking-date-rules";

export default function AgendamentoCalendar({
  selectedDate,
  onSelect,
  activeWeekdays = [],
  diasBloqueados = [],
  disablePastDates = true,
  isCalendarDataReady = true,
  showContainer = true,
  showSelectedSummary = true,
  title = "Data",
  className = "",
  monthPickerVariant = "default",
  mobileCalendarCentered = false,
  calendarTone = "dark",
}: AgendamentoCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 639px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setIsNarrowViewport(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const useCenterOverlay = Boolean(
    mobileCalendarCentered && isNarrowViewport,
  );

  useEffect(() => {
    setIsOpen(false);
  }, [useCenterOverlay]);

  useEffect(() => {
    if (!useCenterOverlay || !isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [useCenterOverlay, isOpen]);

  const getDayName = (date: Date) => {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return days[date.getDay()];
  };

  const handleSelectDate = useCallback(
    (date: Date | undefined) => {
      if (!date) return;

      onSelect(date);

      setIsOpen(false);
    },
    [onSelect],
  );

  const isLight = calendarTone === "light";

  const panelSurface = isLight
    ? "border-neutral-200 bg-white shadow-xl"
    : "border-neutral-700 bg-neutral-900";

  const calendarClassName = useMemo(
    () =>
      cn(
        isLight
          ? "bg-white text-neutral-900 [--rdp-accent-color:#B8952E] [--rdp-accent-background:#B8952E] [&_.rdp-caption]:text-[#5c4a16] [&_.rdp-nav_button]:text-[#5c4a16] hover:[&_.rdp-nav_button]:bg-neutral-100 [&_.rdp-head_cell]:text-[#6b5a20] [&_.rdp-day]:text-neutral-900 [&_.rdp-day_today]:font-bold [&_.rdp-day_today]:text-[#111111] [&_.rdp-day_selected]:bg-[#B8952E] [&_.rdp-day_selected]:text-black [&_.rdp-day_selected]:font-bold [&_.rdp-day_selected]:border-2 [&_.rdp-day_selected]:border-[#F2D37A] [&_.rdp-day_disabled]:opacity-35 [&_.rdp-day_disabled]:text-neutral-400 [&_.rdp-button:hover:not([disabled])]:bg-neutral-100"
          : "bg-neutral-900 text-white [--rdp-accent-color:#B8952E] [--rdp-accent-background:#B8952E] [&_.rdp-caption]:text-[#F2D37A] [&_.rdp-nav_button]:text-[#F2D37A] hover:[&_.rdp-nav_button]:bg-neutral-700 [&_.rdp-head_cell]:text-[#F2D37A] [&_.rdp-day]:text-[#F2D37A] [&_.rdp-day_today]:text-[#F2D37A] [&_.rdp-day_today]:font-bold [&_.rdp-day_selected]:bg-[#B8952E] [&_.rdp-day_selected]:text-black [&_.rdp-day_selected]:font-bold [&_.rdp-day_selected]:border-2 [&_.rdp-day_selected]:border-[#F2D37A] [&_.rdp-day_disabled]:opacity-30 [&_.rdp-day_disabled]:text-white/40 [&_.rdp-button:hover:not([disabled])]:bg-neutral-800",
      ),
    [isLight],
  );

  const triggerIconClass =
    "inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border outline-none transition focus-visible:ring-2 focus-visible:ring-[#B8952E]";
  const triggerIconSurface = isLight
    ? cn(
        triggerIconClass,
        "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:border-[#B8952E]/45 hover:bg-[var(--app-surface-2)]",
      )
    : cn(
        triggerIconClass,
        "border-white/12 bg-black text-white hover:border-[#B8952E]/55 hover:bg-white/5",
      );

  const triggerDefaultSurface = isLight
    ? "flex w-full items-center gap-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 text-[var(--app-text)] transition-colors hover:border-[#B8952E]/35"
    : "flex w-full items-center gap-3 rounded-lg border border-white/10 bg-black px-4 py-3 text-white transition-colors hover:border-white/20";

  const calendarEl = (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelectDate}
      disabled={(date) =>
        isBookingDateDisabled(date, {
          isCalendarDataReady,
          disablePastDates,
          diasBloqueados,
          activeWeekdays,
        })
      }
      showOutsideDays
      classNames={{
        day_selected:
          "rdp-day_selected bg-[#B8952E] text-black font-bold border-2 border-[#F2D37A]",
      }}
      className={calendarClassName}
    />
  );

  const iconTriggerBtn = (
    <button
      type="button"
      title="Abrir calendário"
      aria-label="Abrir calendário para escolher a data"
      className={triggerIconSurface}
      {...(useCenterOverlay ? { onClick: () => setIsOpen(true) } : {})}
    >
      <CalendarIcon className="h-5 w-5 text-[#B8952E]" />
    </button>
  );

  const defaultTriggerBtn = (
    <button
      type="button"
      className={triggerDefaultSurface}
      {...(useCenterOverlay ? { onClick: () => setIsOpen(true) } : {})}
    >
      <CalendarIcon className="h-5 w-5 text-[#B8952E]" />
      {selectedDate
        ? selectedDate.toLocaleDateString("pt-BR")
        : "Selecione uma data"}
    </button>
  );

  const pickerTrigger =
    monthPickerVariant === "icon" ? iconTriggerBtn : defaultTriggerBtn;

  const overlayPortal =
    useCenterOverlay &&
    isOpen &&
    typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-5 sm:hidden">
            <button
              type="button"
              className={cn(
                "absolute inset-0",
                isLight ? "bg-neutral-950/35" : "bg-black/60",
              )}
              aria-label="Fechar calendário"
              onClick={() => setIsOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              className={cn(
                "relative z-[1] max-h-[85vh] w-full max-w-sm overflow-auto rounded-3xl border p-2",
                panelSurface,
              )}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {calendarEl}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      className={`${showContainer ? "rounded-[15px] bg-neutral-800 p-4" : ""} ${className}`.trim()}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-[#B8952E]">{title}</h2>
      ) : null}

      {useCenterOverlay ? (
        pickerTrigger
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>{pickerTrigger}</PopoverTrigger>
          <PopoverContent
            align="center"
            className={cn("w-auto border p-0 shadow-xl", panelSurface)}
          >
            {calendarEl}
          </PopoverContent>
        </Popover>
      )}
      {overlayPortal}

      {showSelectedSummary && selectedDate && (
        <div
          className={cn(
            "mt-4 rounded-lg border border-[#B8952E]/35 p-3",
            isLight ? "bg-[var(--app-surface)]" : "bg-black",
          )}
        >
          <p
            className={cn(
              "text-xs uppercase tracking-wider",
              isLight ? "text-[var(--app-text-muted)]" : "text-white/70",
            )}
          >
            Data selecionada
          </p>
          <p
            className={cn(
              "mt-1 text-lg font-bold",
              isLight ? "text-[#956d12]" : "text-[#F2D37A]",
            )}
          >
            {getDayName(selectedDate)} ·{" "}
            {selectedDate.toLocaleDateString("pt-BR")}
          </p>
        </div>
      )}
    </div>
  );
}
