import React, { useEffect } from "react";
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

  useEffect(() => {
    const token = getPersistedAuthToken();

    // If there's no token at all, redirect immediately to login
    if (!token) {
      navigate("/login");
      return;
    }

    // If token exists but validation finished and no user, redirect
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Optionally show nothing while loading to avoid flicker
  if (loading) return null;

  return <>{children}</>;
}
