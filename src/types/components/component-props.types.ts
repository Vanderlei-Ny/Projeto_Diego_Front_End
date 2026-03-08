import type { ReactNode } from "react";

export interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export interface BarbershopLogoProps {
  variant?: "mobile" | "desktop";
  className?: string;
}

export interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  date?: string;
}

export interface EditProfileModalProps {
  isOpen: boolean;
  name: string;
  telefone: string;
  isSaving: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onSave: () => void;
}

export interface SocialIconsProps {
  variant: "mobile" | "desktop";
}

export interface RequireAdminProps {
  children: ReactNode;
}

export interface AppErrorBoundaryProps {
  children: ReactNode;
}

export interface AppErrorBoundaryState {
  hasError: boolean;
}

export interface AgendamentoCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  activeWeekdays?: string[];
  diasBloqueados?: string[];
  disablePastDates?: boolean;
  showContainer?: boolean;
  showSelectedSummary?: boolean;
  title?: string;
  className?: string;
}
