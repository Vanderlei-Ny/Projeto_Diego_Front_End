import { Outlet, Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { getPersistedAuthToken } from "@/http/api";
import AppLayout from "./app-layout";
import LoadingSpinner from "./loading-spinner";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const token = getPersistedAuthToken();

  // Mostra loading apenas durante a validação inicial do token
  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-black">
        <LoadingSpinner message="Carregando..." size="lg" />
      </div>
    );
  }

  // Redireciona para login se não tiver token ou usuário
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Layout persistente - não re-renderiza entre rotas filhas
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
