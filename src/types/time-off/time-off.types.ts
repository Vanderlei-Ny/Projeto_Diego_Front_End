export interface DiaBloqueado {
  id: number;
  data: string;
  dataFormatada: string;
  diaSemana: string;
  motivo: string | null;
}

export interface AgendamentoNoDia {
  id: number;
  cliente: string;
  horario: string;
}

export interface DiaBloqueadoErrorResponse {
  agendamentos?: AgendamentoNoDia[];
  error?: string;
}
