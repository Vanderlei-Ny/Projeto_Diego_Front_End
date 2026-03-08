import type { Hierarchy } from "@/types/auth/auth.types";

export type UserHierarchy = Hierarchy;

export interface AdminUser {
  id: number;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  hierarchy: UserHierarchy;
  createdAt: string;
}

export interface DashboardSummaryResponse {
  totals: {
    overall: number;
    week: number;
    month: number;
    range: number;
  };
  filters: {
    startDate: string | null;
    endDate: string | null;
  };
  appointmentsPerDay: {
    date: string;
    label: string;
    total: number;
  }[];
  appointmentsTable: {
    id: number;
    date: string;
    hour: string;
    customerName: string;
    services: string[];
  }[];
}
