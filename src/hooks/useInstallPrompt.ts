import { useCallback, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const isStandaloneDisplay = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  const isIosStandalone = (window.navigator as { standalone?: boolean })
    .standalone;

  return isStandalone || Boolean(isIosStandalone);
};

const isIosBrowser = () => {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const iPhoneOrIpad = /iPad|iPhone|iPod/.test(ua);
  const iPadOs =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;

  return iPhoneOrIpad || iPadOs;
};

export default function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplay());
  const [isIosInstall, setIsIosInstall] = useState(
    () => isIosBrowser() && !isStandaloneDisplay(),
  );

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setIsIosInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return null;
    }

    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    return result;
  }, [deferredPrompt]);

  return {
    canInstall: (Boolean(deferredPrompt) || isIosInstall) && !isInstalled,
    isIosInstall: isIosInstall && !isInstalled,
    promptInstall,
    isInstalled,
  };
}
