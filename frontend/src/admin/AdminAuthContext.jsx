import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  adminApiClient,
  apiClient,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "../lib/apiClient";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const token = getAdminToken();

      if (!token) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await adminApiClient.get("/auth/me");
        if (mounted) {
          setAdminUser(data?.user || null);
        }
      } catch {
        clearAdminToken();
        if (mounted) {
          setAdminUser(null);
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
    const { username, password } = credentials;
    const { data } = await apiClient.post("/auth/admin/login", { username, password });

    setAdminToken(data?.token || "");
    setAdminUser(data?.user || null);

    return data?.user || null;
  }

  function logout() {
    clearAdminToken();
    setAdminUser(null);
  }

  const value = useMemo(
    () => ({
      adminUser,
      loading,
      isAuthenticated: Boolean(adminUser),
      login,
      logout,
    }),
    [adminUser, loading],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }

  return context;
}
