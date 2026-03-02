import { Route } from "react-router-dom";
import ProtectedLayout from "@/components/ProtectedLayout";
import HomeInterface from "@/pages/home-page";
import Agendamento from "@/pages/SchedulingPage";
import { AdminRoutes } from "@/routes/segments/admin.routes";

export function ProtectedRoutes() {
  return (
    <Route element={<ProtectedLayout />}>
      <Route path="/home" element={<HomeInterface />} />
      <Route path="/agendamento" element={<Agendamento />} />
      {AdminRoutes()}
    </Route>
  );
}
