import { Outlet } from "react-router-dom";
import { AdminHeader } from "./components/AdminHeader";
import { AdminSidebar } from "./components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 lg:flex">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[280px] xl:pl-[300px]">
        <AdminHeader />
        <main className="p-6 md:p-8 lg:p-10 mx-auto w-full max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
