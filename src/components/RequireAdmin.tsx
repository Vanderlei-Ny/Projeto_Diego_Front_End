import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./loading-spinner";
import type { RequireAdminProps } from "@/types/components/component-props.types";

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Verificando permissões..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
