export const BUSINESS_TIMEZONE = "America/Sao_Paulo";

type DateParts = {
  year: number;
  month: number;
  day: number;
};

const MONTHS_PT_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

const toBrDateKey = (parts: DateParts) =>
  `${String(parts.day).padStart(2, "0")}/${String(parts.month).padStart(2, "0")}/${parts.year}`;

const toIsoDateKey = (parts: DateParts) =>
  `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;

const getDatePartsInBusinessTimezone = (
  value: Date = new Date(),
): DateParts | null => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(value);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return null;
  }

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
};

const addDays = (parts: DateParts, daysToAdd: number): DateParts => {
  const utcDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  utcDate.setUTCDate(utcDate.getUTCDate() + daysToAdd);

  return {
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
  };
};

export const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const formatIsoDateToShortPtBr = (isoDate: string) => {
  if (!isIsoDate(isoDate)) {
    return isoDate;
  }

  const [, monthRaw, dayRaw] = isoDate.split("-");
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return isoDate;
  }

  return `${day} ${MONTHS_PT_SHORT[month - 1]}`;
};

export const formatIsoDateToBr = (isoDate: string) => {
  if (!isIsoDate(isoDate)) {
    return isoDate;
  }

  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

export const getTodayAndTomorrowBrDateKeys = () => {
  const today = getDatePartsInBusinessTimezone();

  if (!today) {
    return { todayKey: null, tomorrowKey: null };
  }

  const tomorrow = addDays(today, 1);

  return {
    todayKey: toBrDateKey(today),
    tomorrowKey: toBrDateKey(tomorrow),
  };
};

export const getBusinessTodayIsoDate = () => {
  const today = getDatePartsInBusinessTimezone();
  return today ? toIsoDateKey(today) : null;
};

export const formatIsoDateTime = (isoDate: string, hour: string) => {
  if (!isIsoDate(isoDate)) {
    return `${isoDate} ${hour}`;
  }

  const brDate = formatIsoDateToBr(isoDate);

  const normalizedHour = /^\d{2}:\d{2}$/.test(hour)
    ? `${hour}:00`
    : /^\d{2}:\d{2}:\d{2}$/.test(hour)
      ? hour
      : null;

  if (!normalizedHour) {
    return `${brDate} ${hour}`;
  }

  return `${brDate} ${normalizedHour.slice(0, 5)}`;
};
