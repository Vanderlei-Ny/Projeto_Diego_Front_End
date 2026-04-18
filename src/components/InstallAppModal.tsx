import type { InstallAppModalProps } from "@/types/components/component-props.types";

export default function InstallAppModal({
  isOpen,
  onConfirm,
  onCancel,
}: InstallAppModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-black/90 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-lg border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-lg font-semibold mb-2">
          Instalar como aplicativo
        </h2>
        <p className="text-white/80 text-sm sm:text-base mb-5">
          Deseja adicionar este site como aplicativo na sua area de trabalho?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition cursor-pointer text-sm font-medium"
          >
            Agora nao
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#B8952E] text-black rounded hover:bg-yellow-400 transition cursor-pointer text-sm font-medium"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
