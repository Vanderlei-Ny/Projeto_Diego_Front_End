export type ThemeMode = "dark" | "light";

export type AppThemeContextValue = {
  mode: ThemeMode;
  isDarkMode: boolean;
  toggleMode: () => void;
};
