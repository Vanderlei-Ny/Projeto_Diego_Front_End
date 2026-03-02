import { Routes } from "react-router-dom";
import { PublicRoutes } from "@/routes/segments/public.routes";
import { ProtectedRoutes } from "@/routes/segments/protected.routes";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      {ProtectedRoutes()}
    </Routes>
  );
}
