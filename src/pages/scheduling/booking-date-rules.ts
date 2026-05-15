import dayjs from "dayjs";

/** Valida seleção igual ao disabled() do mini-calendário (dias úteis, bloqueados, futuro). */
export function isBookingDateDisabled(
  date: Date,
  opts: {
    isCalendarDataReady: boolean;
    disablePastDates: boolean;
    diasBloqueados: string[];
    activeWeekdays: string[];
  },
): boolean {
  const {
    isCalendarDataReady,
    disablePastDates,
    diasBloqueados,
    activeWeekdays,
  } = opts;

  if (!isCalendarDataReady) return true;

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const isPast = date < today;
  if (disablePastDates && isPast) return true;

  const dateStr = dayjs(date).format("YYYY-MM-DD");
  if (diasBloqueados.includes(dateStr)) return true;

  if (activeWeekdays?.length > 0) {
    const weekdayIndex = date.getDay();
    const weekdayMap = [
      "DOMINGO",
      "SEGUNDA",
      "TERCA",
      "QUARTA",
      "QUINTA",
      "SEXTA",
      "SABADO",
    ] as const;
    const weekday = weekdayMap[weekdayIndex];
    return !weekday || !activeWeekdays.includes(weekday);
  }

  return false;
}
