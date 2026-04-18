import type { ConfirmModalProps } from "@/types/components/component-props.types";
import { createPortal } from "react-dom";

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  isOpen,
  isProcessing = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onClick={onCancel}
    >
      <div
        data-app-modal-backdrop
        className="absolute inset-0"
        aria-hidden
      />
      <div
        data-app-modal-panel
        className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 rounded-2xl p-4 shadow-lg duration-200 sm:w-80 sm:p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 text-center text-sm text-white sm:mb-6 sm:text-base">
          {message}
        </p>
        <div className="flex justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 cursor-pointer rounded px-4 py-2 text-sm font-medium transition hover:bg-gray-200 disabled:opacity-60 sm:flex-auto sm:px-6 sm:py-2.5 sm:text-base bg-white text-black"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 cursor-pointer rounded bg-[#B8952E] px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-400 disabled:opacity-60 sm:flex-auto sm:px-6 sm:py-2.5 sm:text-base"
          >
            {isProcessing ? "Excluindo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
