import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import api from "@/http/api";
import { ENDPOINTS } from "@/endpoints";
import type { DashboardSummaryResponse } from "@/types/admin/admin.types";

const formatQueryDate = (value?: Date) =>
  value ? dayjs(value).format("YYYY-MM-DD") : undefined;

const toStartOfDay = (date: dayjs.ConfigType) =>
  dayjs(date).startOf("day").toDate();

const quickRanges = [
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 30 dias", days: 30 },
  { label: "Últimos 90 dias", days: 90 },
];

const dateFormat = new Intl.DateTimeFormat("pt-BR");

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function useAdminDashboardPage() {
  const defaultEndDate = useMemo(() => toStartOfDay(new Date()), []);
  const defaultStartDate = useMemo(
    () => toStartOfDay(dayjs().subtract(30, "day")),
    [],
  );

  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultStartDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(defaultEndDate);

  const queryParams = useMemo(
    () => ({
      startDate: formatQueryDate(startDate),
      endDate: formatQueryDate(endDate),
    }),
    [startDate, endDate],
  );

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-dashboard-summary",
      queryParams.startDate,
      queryParams.endDate,
    ],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.scheduling.adminDashboardSummary, {
        params: {
          ...(queryParams.startDate
            ? { startDate: queryParams.startDate }
            : {}),
          ...(queryParams.endDate ? { endDate: queryParams.endDate } : {}),
        },
      });

      return res.data as DashboardSummaryResponse;
    },
  });

  const totals = data?.totals;
  const chartData = data?.appointmentsPerDay ?? [];
  const appointmentsTable = data?.appointmentsTable ?? [];

  const isDefaultRange =
    !!startDate &&
    !!endDate &&
    dayjs(startDate).isSame(defaultStartDate, "day") &&
    dayjs(endDate).isSame(defaultEndDate, "day");

  const hasCustomRange = !isDefaultRange;

  const dateRangeLabel =
    startDate && endDate
      ? `${dateFormat.format(startDate)} - ${dateFormat.format(endDate)}`
      : "Período personalizado";

  const applyQuickRange = (days: number) => {
    const nextEndDate = toStartOfDay(new Date());
    const nextStartDate = toStartOfDay(
      dayjs(nextEndDate).subtract(days - 1, "day"),
    );

    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
  };

  const clearRange = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  const isQuickRangeActive = (days: number) => {
    return (
      !!startDate &&
      !!endDate &&
      dayjs(endDate).isSame(toStartOfDay(new Date()), "day") &&
      dayjs(startDate).isSame(
        toStartOfDay(dayjs(new Date()).subtract(days - 1, "day")),
        "day",
      )
    );
  };

  const formatAppointmentDateTime = (date: string, hour: string) => {
    const dateTime = new Date(`${date}T${hour}`);

    if (Number.isNaN(dateTime.getTime())) {
      return `${date} ${hour}`;
    }

    return dateTimeFormat.format(dateTime);
  };

  return {
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
  };
}
