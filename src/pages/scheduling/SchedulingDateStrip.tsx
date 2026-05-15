import { useMemo } from "react";
import dayjs from "dayjs";
import { isBookingDateDisabled } from "./booking-date-rules";

type SchedulingDateStripProps = {
  selectedDate: Date | undefined;
  onSelect: (date: Date) => void;
  activeWeekdays: string[];
  diasBloqueados: string[];
  isCalendarDataReady: boolean;
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function weekdayShort(d: Date) {
  const s = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(d)
    .replace(/\./g, "")
    .toUpperCase();
  return s.slice(0, 3);
}

export default function SchedulingDateStrip({
  selectedDate,
  onSelect,
  activeWeekdays,
  diasBloqueados,
  isCalendarDataReady,
}: SchedulingDateStripProps) {
  const days = useMemo(() => {
    const out: Date[] = [];
    const start = dayjs().startOf("day");
    for (let i = 0; i < 56; i++) {
      out.push(start.add(i, "day").toDate());
    }
    return out;
  }, []);

  return (
    <div
      className="flex gap-2.5 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      role="list"
      aria-label="Dias disponíveis"
    >
      {days.map((day) => {
        const disabled = isBookingDateDisabled(day, {
          isCalendarDataReady,
          disablePastDates: true,
          diasBloqueados,
          activeWeekdays,
        });
        const selected = Boolean(selectedDate && sameDay(day, selectedDate));

        return (
          <button
            key={day.toISOString()}
            type="button"
            role="listitem"
            disabled={disabled}
            onClick={() => onSelect(day)}
            className={`flex min-h-[4.5rem] min-w-[3.35rem] shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-3 text-center text-xs font-semibold transition-all ${
              disabled
                ? "cursor-not-allowed border-[var(--app-border-soft)] bg-[var(--app-surface-2)] text-[var(--app-text-muted)] opacity-55"
                : selected
                  ? "border-[#B8952E]/80 bg-[#B8952E]/25 text-neutral-900 shadow-md shadow-neutral-900/10"
                  : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:border-[#B8952E]/55 hover:bg-[var(--app-surface-2)]"
            }`}
          >
            <span
              className={`text-[0.65rem] font-bold tracking-wide ${selected ? "text-neutral-800/85" : "text-[var(--app-text-muted)]"}`}
            >
              {weekdayShort(day)}
            </span>
            <span className="font-mono text-base font-bold">{day.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
