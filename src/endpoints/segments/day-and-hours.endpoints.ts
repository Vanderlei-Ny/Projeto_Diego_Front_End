export const DAY_AND_HOURS_ENDPOINTS = {
  listAll: "/dayAndHours/listAll",
  createDay: "/dayAndHours/createDay",
  addHour: "/dayAndHours/addHour",
  removeHour: (hourId: number) => `/dayAndHours/removeHour/${hourId}`,
  toggleDay: (dayId: number) => `/dayAndHours/toggleDay/${dayId}`,
  removeDay: (dayId: number) => `/dayAndHours/removeDay/${dayId}`,
} as const;
