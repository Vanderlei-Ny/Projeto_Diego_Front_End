import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { getPersistedAuthToken } from "@/http/api";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Wait for loading to finish before making decisions
    if (loading) {
      setShouldRender(false);
      return;
    }

    const token = getPersistedAuthToken();

    // If no token or no user after validation, redirect to login
    if (!token || !user) {
      navigate("/login", { replace: true });
      setShouldRender(false);
      return;
    }

    // All checks passed, allow rendering
    setShouldRender(true);
  }, [loading, user, navigate]);

  // Show loading state while validating token
  // if (loading) {
  //   return <LoadingSpinner fullScreen message="Carregando..." />;
  // }

  // If not loading but no user or shouldn't render, don't render children
  // if (!user || !shouldRender) {
  //   return <LoadingSpinner fullScreen message="Redirecionando..." />;
  // }

  return <>{children}</>;
}
