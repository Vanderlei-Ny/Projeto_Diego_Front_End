import { createRoot } from "react-dom/client";
import { suppressKnownBrowserNoise } from "./suppressKnownBrowserNoise";
import "./index.css";

suppressKnownBrowserNoise();
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { GOOGLE_WEB_CLIENT_ID } from "./config/google";

const queryClient = new QueryClient();

if (!GOOGLE_WEB_CLIENT_ID && import.meta.env.DEV) {
  console.warn(
    "[auth] VITE_GOOGLE_CLIENT_ID não definido — login com Google não funcionará.",
  );
}

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </AppErrorBoundary>,
);
