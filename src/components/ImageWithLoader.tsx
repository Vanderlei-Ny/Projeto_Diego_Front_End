import * as React from "react";
import { cn } from "@/lib/utils";

type ImageWithLoaderProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string;
  loaderClassName?: string;
  errorFallbackText?: string;
};

const loadedImageSrcCache = new Set<string>();

export default function ImageWithLoader({
  src,
  alt = "Imagem",
  className,
  containerClassName,
  loaderClassName,
  errorFallbackText = "Falha ao carregar",
  onLoad,
  onError,
  ...props
}: ImageWithLoaderProps) {
  const normalizedSrc = typeof src === "string" ? src.trim() : "";

  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    normalizedSrc
      ? loadedImageSrcCache.has(normalizedSrc)
        ? "loaded"
        : "loading"
      : "error",
  );

  React.useEffect(() => {
    if (!normalizedSrc) {
      setStatus("error");
      return;
    }

    if (loadedImageSrcCache.has(normalizedSrc)) {
      setStatus("loaded");
      return;
    }

    setStatus("loading");
  }, [normalizedSrc]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {status === "loading" && (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center bg-black/30",
            loaderClassName,
          )}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#B8952E]/30 border-t-[#B8952E]" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-800/90 p-2 text-xs text-white/70">
          {errorFallbackText}
        </div>
      )}

      <img
        {...props}
        src={normalizedSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={(event) => {
          if (normalizedSrc) {
            loadedImageSrcCache.add(normalizedSrc);
          }
          setStatus("loaded");
          onLoad?.(event);
        }}
        onError={(event) => {
          setStatus("error");
          onError?.(event);
        }}
      />
    </div>
  );
}
