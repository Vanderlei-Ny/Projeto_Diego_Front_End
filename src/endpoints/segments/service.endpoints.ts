export const SERVICE_ENDPOINTS = {
  base: "/service",
  listAllPublic: "/service/listAllServices",
  create: "/service/createService",
  remove: (serviceId: number) => `/service/deleteService/${serviceId}`,
} as const;
