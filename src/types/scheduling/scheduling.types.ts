export interface Hour {
  id: number;
  availableHour: string;
}

export interface DayWithHours {
  id: number;
  weekday: string;
  isActive: boolean;
  hours: Hour[];
}

export type DiaDaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

export interface VerifyDayResponse {
  message: string;
  dayId: number;
  hoursDisponible: Hour[];
  hoursAgendados: Hour[];
}

export interface AgendamentoService {
  id: number;
  nome: string;
  valor: string;
}

export interface AdminAgendamento {
  id: number;
  dataAgendamento: string;
  dataOriginal: string;
  nomeCliente: string;
  telefone: string | null;
  email: string | null;
  userId: number | null;
  agendado: boolean;
  horario: string;
  diaDaSemana: string;
  services: AgendamentoService[];
}

export interface DayData {
  dayId: number;
  hoursDisponible: Hour[];
  hoursAgendados: Hour[];
}

export interface UserSchedulingResponse {
  id?: number;
  dataAgendamento: string;
  hour: { availableHour: string };
  service?: Array<{ name: string }>;
}
