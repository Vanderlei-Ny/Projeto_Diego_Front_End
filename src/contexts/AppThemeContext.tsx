import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  AppThemeContextValue,
  ThemeMode,
} from "@/types/theme/theme.types";

const STORAGE_KEY = "app-theme-mode";

const AppThemeContext = createContext<AppThemeContextValue | undefined>(
  undefined,
);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY);
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.classList.remove(
      "app-theme-dark",
      "app-theme-light",
    );
    document.documentElement.classList.add(
      mode === "dark" ? "app-theme-dark" : "app-theme-light",
    );
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      isDarkMode: mode === "dark",
      toggleMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }

  return context;
}
