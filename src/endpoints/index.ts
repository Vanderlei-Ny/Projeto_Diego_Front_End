import { AUTH_ENDPOINTS } from "./segments/auth.endpoints";
import { USER_ENDPOINTS } from "./segments/user.endpoints";
import { SERVICE_ENDPOINTS } from "./segments/service.endpoints";
import { SCHEDULING_ENDPOINTS } from "./segments/scheduling.endpoints";
import { DAY_AND_HOURS_ENDPOINTS } from "./segments/day-and-hours.endpoints";
import { BLOCKED_DAY_ENDPOINTS } from "./segments/blocked-day.endpoints";
import { CAROUSEL_ENDPOINTS } from "./segments/carousel.endpoints";

export const ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  user: USER_ENDPOINTS,
  service: SERVICE_ENDPOINTS,
  scheduling: SCHEDULING_ENDPOINTS,
  dayAndHours: DAY_AND_HOURS_ENDPOINTS,
  blockedDay: BLOCKED_DAY_ENDPOINTS,
  carousel: CAROUSEL_ENDPOINTS,
} as const;

export {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  SERVICE_ENDPOINTS,
  SCHEDULING_ENDPOINTS,
  DAY_AND_HOURS_ENDPOINTS,
  BLOCKED_DAY_ENDPOINTS,
  CAROUSEL_ENDPOINTS,
};
