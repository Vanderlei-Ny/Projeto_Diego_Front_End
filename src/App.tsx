import { BrowserRouter } from "react-router-dom";
import { AppThemeProvider } from "./contexts/AppThemeContext";
import ThemeModeFab from "./components/theme-mode-fab";
import AppRoutes from "@/routes/app-routes";

export default function App() {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ThemeModeFab />
    </AppThemeProvider>
  );
}
