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
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-black/50 rounded-2xl p-6 w-80 max-w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-6 text-center text-white">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white rounded hover:bg-gray-400 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
