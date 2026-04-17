import { NavLink, Outlet } from "react-router-dom";
import { useEmployeeAuth } from "./EmployeeAuthContext";
import { BrandLogo } from "../components/common/BrandLogo";

const navItems = [
  { to: "/employee/dashboard", label: "Dashboard" },
  { to: "/employee/attendance", label: "Attendance" },
  { to: "/employee/leave", label: "Leave" },
];

export default function EmployeeLayout() {
  const { employeeUser, logout } = useEmployeeAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="w-full shrink-0 border-r border-slate-200 bg-white p-4 lg:w-72 lg:p-6 lg:flex lg:flex-col">
        <div className="mb-8">
          <BrandLogo variant="dark" className="h-8 w-auto" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Logged in as</p>
          <p className="mt-1 text-sm font-bold text-slate-900 uppercase">{employeeUser?.fullName || "Employee"}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-600">
            {employeeUser?.employeeCode || "-"} • {employeeUser?.department || "-"}
          </p>
        </div>

        <nav className="mt-8 flex-1 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-blue-50 text-[#2563eb]" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
