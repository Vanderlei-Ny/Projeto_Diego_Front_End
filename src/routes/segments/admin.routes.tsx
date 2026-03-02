import { Route } from "react-router-dom";
import RequireAdmin from "@/components/RequireAdmin";
import AdminPage from "@/pages/admin";
import AdminDashboardPage from "@/pages/admin/dashboardPage";
import AdminHoursPage from "@/pages/admin-hours";
import AdminServicesPage from "@/pages/admin-services";
import AdminUsersPage from "@/pages/admin-users";
import AdminTimeOffPage from "@/pages/admin-time-off";
import CarouselPage from "@/pages/admin/CarouselPage";

export function AdminRoutes() {
  return (
    <>
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
            <AdminHoursPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/servicos"
        element={
          <RequireAdmin>
            <AdminServicesPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <RequireAdmin>
            <AdminUsersPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/folgas"
        element={
          <RequireAdmin>
            <AdminTimeOffPage />
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
    </>
  );
}
