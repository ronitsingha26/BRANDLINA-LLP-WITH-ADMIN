import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  apiClient,
  clearEmployeeToken,
  employeeApiClient,
  getEmployeeToken,
  setEmployeeToken,
} from "../lib/apiClient";

const EmployeeAuthContext = createContext(null);

export function EmployeeAuthProvider({ children }) {
  const [employeeUser, setEmployeeUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const token = getEmployeeToken();

      if (!token) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await employeeApiClient.get("/auth/me");
        if (mounted) {
          setEmployeeUser(data?.user || null);
        }
      } catch {
        clearEmployeeToken();
        if (mounted) {
          setEmployeeUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(credentials) {
    const { identifier, password } = credentials;
    const { data } = await apiClient.post("/auth/employee/login", { identifier, password });

    setEmployeeToken(data?.token || "");
    setEmployeeUser(data?.user || null);

    return data?.user || null;
  }

  function logout() {
    clearEmployeeToken();
    setEmployeeUser(null);
  }

  const value = useMemo(
    () => ({
      employeeUser,
      loading,
      isAuthenticated: Boolean(employeeUser),
      login,
      logout,
    }),
    [employeeUser, loading],
  );

  return <EmployeeAuthContext.Provider value={value}>{children}</EmployeeAuthContext.Provider>;
}

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);

  if (!context) {
    throw new Error("useEmployeeAuth must be used inside EmployeeAuthProvider");
  }

  return context;
}
