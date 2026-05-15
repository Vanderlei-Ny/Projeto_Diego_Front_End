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
                ? "cursor-not-allowed border-white/[0.06] bg-black/30 text-white/25"
                : selected
                  ? "border-[#B8952E]/80 bg-[#B8952E]/20 text-[#F2D37A] shadow-md shadow-black/25"
                  : "border-white/10 bg-black/50 text-white/90 hover:border-[#B8952E]/35 hover:bg-black/70"
            }`}
          >
            <span className="text-[0.65rem] font-bold tracking-wide text-white/60">
              {weekdayShort(day)}
            </span>
            <span className="font-mono text-base font-bold">{day.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
