import type { LoadingSpinnerProps } from "@/types/components/component-props.types";
import { createPortal } from "react-dom";

export function LoadingSpinner({
  message = "Carregando...",
  size = "md",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (fullScreen) {
    return createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center">
        <div
          data-app-modal-backdrop
          className="absolute inset-0"
          aria-hidden
        />
        <div className="relative z-10 flex animate-in fade-in zoom-in-95 flex-col items-center gap-4 duration-200">
          <div
            className={`${spinnerSizes[size]} animate-spin rounded-full border-3 border-[#B8952E]/30 border-t-[#B8952E]`}
          />
          <p className={`text-white ${textSizes[size]}`}>{message}</p>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${spinnerSizes[size]} animate-spin rounded-full border-3 border-[#B8952E]/30 border-t-[#B8952E]`}
      />
      <p className={`text-white ${textSizes[size]}`}>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
