import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import InsertEmailAndPhoneNumber from "./pages/insert-email-and-phone-number";
import HomeInterface from "./pages/home-page.tsx";
import Agendamento from "./pages/agendamento";
import AdminPage from "./pages/admin";
import HorariosPage from "./pages/admin-horarios";
import ServicosPage from "./pages/admin-servicos";
import FolgasPage from "./pages/admin-folgas";
import CarouselPage from "./pages/admin/carousel";
import AdminDashboardPage from "./pages/admin/dashboard";
import Login from "./pages/login-page.tsx";
import ProtectedLayout from "./components/ProtectedLayout.tsx";
import RequireAdmin from "./components/RequireAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/insertEmailAndPhoneNumber"
          element={<InsertEmailAndPhoneNumber />}
        />

        {/* Rotas protegidas com layout persistente */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<HomeInterface />} />
          <Route path="/agendamento" element={<Agendamento />} />
          {/* Rotas de admin - requer role ADMIN */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/horarios"
            element={
              <RequireAdmin>
                <HorariosPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/servicos"
            element={
              <RequireAdmin>
                <ServicosPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/folgas"
            element={
              <RequireAdmin>
                <FolgasPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/carousel"
            element={
              <RequireAdmin>
                <CarouselPage />
              </RequireAdmin>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
