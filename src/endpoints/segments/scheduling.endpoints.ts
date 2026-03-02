export const SCHEDULING_ENDPOINTS = {
  activeDays: "/agendamento/activeDays",
  verifyDay: "/agendamento/verifyDay",
  createByUser: (userId: number) => `/agendamento/createAgendamento/${userId}`,
  deleteById: (appointmentId: number) =>
    `/agendamento/deleteAgendamento/${appointmentId}`,
  listByUser: (userId: number) =>
    `/agendamento/listAgendamentoOfUser/${userId}`,
  adminListAll: "/agendamento/admin/listAll",
  adminCreate: "/agendamento/admin/createAgendamento",
  adminDashboardSummary: "/agendamento/admin/dashboard-summary",
} as const;
