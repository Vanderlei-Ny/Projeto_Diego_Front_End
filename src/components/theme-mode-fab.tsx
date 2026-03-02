import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "@/contexts/AppThemeContext";

export default function ThemeModeFab() {
  const { isDarkMode, toggleMode } = useAppTheme();

  return (
    <button
      onClick={toggleMode}
      className="app-theme-fab fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-lg transition-colors"
      title={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {isDarkMode ? "Modo claro" : "Modo escuro"}
    </button>
  );
}
