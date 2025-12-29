interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

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
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="flex flex-col items-center gap-4">
          <div
            className={`${spinnerSizes[size]} animate-spin rounded-full border-3 border-[#B8952E]/30 border-t-[#B8952E]`}
          />
          <p className={`text-white ${textSizes[size]}`}>{message}</p>
        </div>
      </div>
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
