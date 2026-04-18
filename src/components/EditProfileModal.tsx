import type { EditProfileModalProps } from "@/types/components/component-props.types";
import { getInitialName } from "@/utils/getInitialNames";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createPortal } from "react-dom";

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
        className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl p-5 shadow-lg duration-200 sm:p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-[#B8952E]">
              {getInitialName(name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Editar perfil
          </h2>
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <label className="text-sm text-white/80">Nome completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isSaving}
            className="h-11 w-full rounded-md border border-white/10 bg-black/70 px-3 text-base text-white placeholder-white/60 focus:border-[#B8952E] focus:outline-none"
            placeholder="Seu nome completo"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <label className="text-sm text-white/80">Telefone</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => onTelefoneChange(e.target.value)}
            disabled={isSaving}
            className="h-11 w-full rounded-md border border-white/10 bg-black/70 px-3 text-base text-white placeholder-white/60 focus:border-[#B8952E] focus:outline-none"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="cursor-pointer rounded bg-[#B8952E] px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
