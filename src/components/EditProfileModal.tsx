import type { EditProfileModalProps } from "@/types/components/component-props.types";

export default function EditProfileModal({
  isOpen,
  name,
  telefone,
  isSaving,
  onClose,
  onNameChange,
  onTelefoneChange,
  onSave,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-black/90 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-lg border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-lg font-semibold mb-4">Editar perfil</h2>

        <div className="flex flex-col gap-2 mb-3">
          <label className="text-sm text-white/80">Nome completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isSaving}
            className="border border-white/10 rounded-md w-full h-11 bg-black/70 placeholder-white/60 text-white text-base px-3 focus:border-[#B8952E] focus:outline-none"
            placeholder="Seu nome completo"
          />
        </div>

        <div className="flex flex-col gap-2 mb-5">
          <label className="text-sm text-white/80">Telefone</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => onTelefoneChange(e.target.value)}
            disabled={isSaving}
            className="border border-white/10 rounded-md w-full h-11 bg-black/70 placeholder-white/60 text-white text-base px-3 focus:border-[#B8952E] focus:outline-none"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition cursor-pointer text-sm font-medium disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[#B8952E] text-black rounded hover:bg-yellow-400 transition cursor-pointer text-sm font-medium disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
