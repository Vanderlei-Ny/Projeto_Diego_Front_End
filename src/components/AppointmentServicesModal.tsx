import type { AppointmentServicesModalProps } from "@/types/components/component-props.types";
import { createPortal } from "react-dom";

export default function AppointmentServicesModal({
  isOpen,
  onClose,
  dateLabel,
  timeLabel,
  services,
}: AppointmentServicesModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        data-app-modal-backdrop
        className="absolute inset-0"
        aria-hidden
      />
      <div
        data-app-modal-panel
        className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-lg duration-200 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-services-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="appointment-services-title"
          className="mb-1 text-lg font-semibold text-[#B8952E]"
        >
          Serviços do agendamento
        </h2>
        <p className="mb-4 text-sm text-white/80">
          <span className="text-white">{dateLabel}</span>
          {" · "}
          <span className="text-white">{timeLabel}</span>
        </p>

        {services.length === 0 ? (
          <p className="mb-5 text-sm text-white/60">
            Nenhum serviço vinculado a este agendamento.
          </p>
        ) : (
          <ul className="mb-5 max-h-[min(50vh,280px)] space-y-2 overflow-y-auto pr-1">
            {services.map((name, index) => (
              <li
                key={`${name}-${index}`}
                className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white/90"
              >
                {name}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded bg-[#B8952E] px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
