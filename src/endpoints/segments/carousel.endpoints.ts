export const CAROUSEL_ENDPOINTS = {
  base: "/carousel",
  byId: (imageId: number) => `/carousel/${imageId}`,
} as const;
