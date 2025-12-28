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

const clientId =
  "540965651267-o2t36mag85s94nkv6ajmkmka54gg132p.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <StrictMode>
        <Main />
      </StrictMode>
    </AuthProvider>
  </GoogleOAuthProvider>
);
