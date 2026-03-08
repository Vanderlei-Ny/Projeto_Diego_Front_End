import type { BarbershopLogoProps } from "@/types/components/component-props.types";
import ImageWithLoader from "@/components/ImageWithLoader";

export default function BarbershopLogo({
  variant = "desktop",
  className = "",
}: BarbershopLogoProps) {
  const baseStyles =
    "flex items-center justify-center bg-neutral-900 text-[#B8952E] rounded-[15px] p-2 gap-2";

  const variantStyles = {
    mobile: "text-xs sm:text-sm",
    desktop: "text-base",
  };

  const iconStyles = {
    mobile: "w-4 h-4 sm:w-5 sm:h-5",
    desktop: "w-5 h-5",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <p>Barbearia Diego Bueno</p>
      <ImageWithLoader
        src="/scissors.svg"
        alt="Tesoura"
        containerClassName={iconStyles[variant]}
        loaderClassName="bg-transparent"
        className="w-full h-full"
      />
    </div>
  );
}
