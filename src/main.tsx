import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import InsertEmailAndPhoneNumber from "./pages/emailAndPhoneNumber.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext";
import HomeInterface from "./pages/home-page.tsx";
import AppLayout from "./components/app-layout";
import RequireAuth from "./components/RequireAuth";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/insertEmailAndPhoneNumber"
          element={<InsertEmailAndPhoneNumber />}
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <AppLayout>
                <HomeInterface />
              </AppLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StrictMode>
          <Main />
          <Toaster position="bottom-right" />
        </StrictMode>
      </AuthProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
