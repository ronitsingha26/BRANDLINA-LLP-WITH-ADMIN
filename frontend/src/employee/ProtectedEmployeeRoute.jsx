import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { useEmployeeAuth } from "./EmployeeAuthContext";

export default function ProtectedEmployeeRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useEmployeeAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/employee-login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
