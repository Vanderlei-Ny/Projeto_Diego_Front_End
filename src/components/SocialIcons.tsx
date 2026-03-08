import { Instagram, MessageCircle, Facebook } from "lucide-react";
import type { SocialIconsProps } from "@/types/components/component-props.types";

const socialLinks = [
  {
    href: "https://wa.me/",
    title: "WhatsApp",
    icon: MessageCircle,
  },
  {
    href: "https://instagram.com/",
    title: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://facebook.com/",
    title: "Facebook",
    icon: Facebook,
  },
];

export default function SocialIcons({ variant }: SocialIconsProps) {
  if (variant === "mobile") {
    return (
      <div className="flex lg:hidden w-full justify-center items-center gap-6 py-3 bg-neutral-800 rounded-[15px]">
        {socialLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            aria-label={link.title}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-700 transition-colors"
          >
            <link.icon className="text-[#B8952E] w-5 h-5" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group hidden lg:flex items-center cursor-pointer">
      <div className="rounded-md w-5 h-full bg-[#B8952E] hover:bg-yellow-400 transition-colors duration-200" />
      <div className="absolute hidden flex-col left-full ml-3 top-1/2 -translate-y-1/2 z-10 group-hover:flex bg-neutral-900/95 rounded-md shadow-lg p-2 gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
        {socialLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            aria-label={link.title}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-800"
          >
            <link.icon className="text-[#B8952E]" />
          </a>
        ))}
      </div>
    </div>
  );
}
