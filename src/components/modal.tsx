interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  date?: string;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-black/80 rounded-2xl p-4 sm:p-6 w-full sm:w-80 max-w-sm shadow-lg border border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 sm:mb-6 text-center text-white text-sm sm:text-base">
          {message}
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 sm:flex-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-black rounded hover:bg-gray-200 transition cursor-pointer text-sm sm:text-base font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 sm:flex-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#B8952E] text-white rounded hover:bg-yellow-400 transition cursor-pointer text-sm sm:text-base font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
