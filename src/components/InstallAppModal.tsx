import type { InstallAppModalProps } from "@/types/components/component-props.types";
import { createPortal } from "react-dom";

export default function InstallAppModal({
  isOpen,
  onConfirm,
  onCancel,
}: InstallAppModalProps) {
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
        className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl p-5 shadow-lg duration-200 sm:p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-semibold text-white">
          Instalar como aplicativo
        </h2>
        <p className="mb-5 text-sm text-white/80 sm:text-base">
          Deseja adicionar este site como aplicativo na sua area de trabalho?
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Agora nao
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded bg-[#B8952E] px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-400"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
