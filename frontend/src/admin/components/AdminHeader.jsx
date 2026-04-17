import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { useAdminAuth } from "../AdminAuthContext";

export function AdminHeader({ setSidebarOpen }) {
  const [status, setStatus] = useState({ loading: true, uploadsMode: "unknown" });
  const [menuOpen, setMenuOpen] = useState(false);
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const menuRef = useRef(null);

  const pageTitle = useMemo(() => {
    const routeMap = [
      ["/admin/cms/dashboard", "Dashboard"],
      ["/admin/cms/projects", "Projects"],
      ["/admin/cms/services", "Services"],
      ["/admin/cms/media", "Media"],
      ["/admin/cms/contacts", "Contacts"],
      ["/admin/cms/employees", "Employees"],
      ["/admin/cms/attendance", "Attendance"],
      ["/admin/cms/leaves", "Leaves"],
      ["/admin/cms/settings", "Settings"],
      ["/admin/cms/homepage", "Homepage"],
      ["/admin/cms/blog", "Blog"],
      ["/admin/cms/careers", "Careers"],
    ];

    const found = routeMap.find(([path]) => location.pathname.startsWith(path));
    return found?.[1] || "CMS Console";
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      try {
        const { data } = await apiClient.get("/health");
        if (mounted) {
          const cloudinaryConfigured = Boolean(data?.cloudinaryConfigured);
          const uploadsMode = data?.uploadsMode || (cloudinaryConfigured ? "cloudinary" : "local");
          setStatus({ loading: false, uploadsMode });
        }
      } catch {
        if (mounted) {
          setStatus({ loading: false, uploadsMode: "unknown" });
        }
      }
    }

    loadStatus();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1e40af]">Admin Panel</p>
          <p className="text-lg font-bold text-slate-900">{pageTitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase ${
            status.loading
              ? "border-slate-200 bg-slate-50 text-slate-500"
              : status.uploadsMode === "cloudinary"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : status.uploadsMode === "local"
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {status.loading
            ? "Checking Uploads"
            : status.uploadsMode === "cloudinary"
              ? "Cloudinary Uploads Ready"
              : status.uploadsMode === "local"
                ? "Local Uploads Active"
                : "Upload Status Unavailable"}
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1e40af] to-[#22c55e] text-[11px] font-bold text-white">
              {(adminUser?.displayName || adminUser?.username || "A").slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden md:block">{adminUser?.displayName || adminUser?.username || "Admin"}</span>
            <span aria-hidden>▾</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Signed in as</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{adminUser?.displayName || adminUser?.username || "Admin"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="mt-2 w-full rounded-xl border border-red-200 px-3 py-2 text-left text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
