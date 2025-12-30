import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import InsertEmailAndPhoneNumber from "./pages/emailAndPhoneNumber.tsx";
import HomeInterface from "./pages/home-page.tsx";
import Agendamento from "./pages/agendamento/index.tsx";
import Login from "./pages/login-page.tsx";
import ProtectedLayout from "./components/ProtectedLayout.tsx";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
