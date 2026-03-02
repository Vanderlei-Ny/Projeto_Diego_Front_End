export const BLOCKED_DAY_ENDPOINTS = {
  base: "/diaBloqueado",
  create: "/diaBloqueado/create",
  remove: (blockedDayId: number) => `/diaBloqueado/remove/${blockedDayId}`,
  checkAppointments: "/diaBloqueado/checkAppointments",
  dates: "/diaBloqueado/datas",
} as const;
