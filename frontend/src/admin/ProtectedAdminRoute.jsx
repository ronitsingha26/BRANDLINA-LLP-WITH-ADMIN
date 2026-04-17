import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useAdminAuth } from "./AdminAuthContext";

export default function ProtectedAdminRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
