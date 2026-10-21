import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import InstallAppModal from "@/components/InstallAppModal";
import useInstallPrompt from "@/hooks/useInstallPrompt";

export default function InstallAppButton() {
  const { canInstall, isIosInstall, isInstalled, promptInstall } =
    useInstallPrompt();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const shouldShowInstall = localStorage.getItem("showInstallPrompt") === "1";

    if (shouldShowInstall && !isInstalled) {
      setIsOpen(true);
      localStorage.removeItem("showInstallPrompt");
    }
  }, [isInstalled]);

  if (isInstalled) return null;

  const handleConfirm = async () => {
    await promptInstall();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Instalar aplicativo"
        aria-label="Instalar aplicativo"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#B8952E] transition hover:bg-sidebar-accent/20"
      >
        <Download className="h-4 w-4" />
      </button>

      <InstallAppModal
        isOpen={isOpen && (canInstall || isIosInstall || !isInstalled)}
        iosInstructions={isIosInstall}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
