import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import api from "@/http/api";
import { ENDPOINTS } from "@/endpoints";
import type { DashboardSummaryResponse } from "@/types/admin/admin.types";
import { formatIsoDateTime } from "@/utils/calendarDate";

const formatQueryDate = (value?: Date) =>
  value ? dayjs(value).format("YYYY-MM-DD") : undefined;

const toStartOfDay = (date: dayjs.ConfigType) =>
  dayjs(date).startOf("day").toDate();

const toEndOfDay = (date: dayjs.ConfigType) =>
  dayjs(date).endOf("day").toDate();

const quickRanges = [
  { label: "Próximos 7 dias", days: 7 },
  { label: "Próximos 30 dias", days: 30 },
  { label: "Próximos 90 dias", days: 90 },
];

const dateFormat = new Intl.DateTimeFormat("pt-BR");

export default function useAdminDashboardPage() {
  const defaultStartDate = useMemo(() => toStartOfDay(new Date()), []);
  const defaultEndDate = useMemo<Date | undefined>(() => undefined, []);

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
  const kpis = data?.kpis ?? {
    clientsTotal: 0,
    servicesTotal: 0,
    appointmentsToday: 0,
    appointmentsTomorrow: 0,
    blockedDaysAhead: 0,
  };
  const revenue = data?.revenue ?? {
    estimatedInRange: 0,
    currency: "BRL",
  };
  const topServicesInRange = data?.topServicesInRange ?? [];
  const chartData = data?.appointmentsPerDay ?? [];
  const appointmentsTable = data?.appointmentsTable ?? [];

  const isDefaultRange =
    !!startDate && dayjs(startDate).isSame(defaultStartDate, "day") && !endDate;

  const hasCustomRange = !isDefaultRange;

  const dateRangeLabel =
    startDate && endDate
      ? `${dateFormat.format(startDate)} - ${dateFormat.format(endDate)}`
      : startDate
        ? `A partir de ${dateFormat.format(startDate)}`
        : "Período personalizado";

  const applyQuickRange = (days: number) => {
    const nextStartDate = toStartOfDay(new Date());
    const nextEndDate = toEndOfDay(dayjs(nextStartDate).add(days - 1, "day"));

    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
  };

  const clearRange = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  const isQuickRangeActive = (days: number) => {
    const today = toStartOfDay(new Date());
    const expectedEndDate = toEndOfDay(dayjs(today).add(days - 1, "day"));

    return (
      !!startDate &&
      !!endDate &&
      dayjs(startDate).isSame(today, "day") &&
      dayjs(endDate).isSame(expectedEndDate, "minute")
    );
  };

  const formatAppointmentDateTime = (date: string, hour: string) => {
    return formatIsoDateTime(date, hour);
  };

  return {
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
  };
}
