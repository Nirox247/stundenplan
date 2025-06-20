import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("user" | "teacher" | "manager" | "admin")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Lade Benutzerinformationen...</p>;
  if (!user) return <Navigate to="/login" replace />;

  if (!role || !allowedRoles.includes(role)) {
    return <p>⛔ Kein Zugriff</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
