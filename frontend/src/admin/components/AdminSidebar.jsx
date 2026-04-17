import { Link, NavLink, useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/common/BrandLogo";
import { useAdminAuth } from "../AdminAuthContext";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Briefcase, 
  Image as ImageIcon, 
  Contact, 
  MessageSquare,
  Users, 
  CalendarCheck, 
  CalendarOff, 
  Settings 
} from "lucide-react";

const menuItems = [
  { to: "/admin/cms/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/cms/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/cms/services", label: "Services", icon: Briefcase },
  { to: "/admin/cms/contacts", label: "Contacts", icon: Contact },
  { to: "/admin/cms/employees", label: "Employees", icon: Users },
  { to: "/admin/cms/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/admin/cms/leaves", label: "Leaves", icon: CalendarOff },
  { to: "/admin/cms/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  function handleBackToLogin() {
    logout();
    navigate("/admin-login", { replace: true });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-full flex-col border-r border-slate-200 bg-[#F8FAFC] pb-6 lg:w-[280px] xl:w-[300px]">
      <div className="flex-none p-6">
        <Link to="/admin-login" className="mb-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:text-slate-600">
          ← Back to Login
        </Link>
        <Link to="/admin-login" className="inline-flex items-center">
          <BrandLogo variant="sidebar" />
        </Link>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Admin Console</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-all duration-200 ease-in-out ${
                isActive 
                  ? "bg-emerald-50 text-emerald-800 font-semibold shadow-sm" 
                  : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-md bg-emerald-500" />
                )}
                <item.icon 
                  className={`h-5 w-5 transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-4 pt-6">
        <button
          type="button"
          onClick={handleBackToLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Secure Logout
        </button>
      </div>
    </aside>
  );
}
