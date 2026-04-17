import { useEffect, useState } from "react";
import { FolderKanban, Briefcase, Contact, Users, CheckCircle2, CalendarOff } from "lucide-react";
import { adminApiClient as apiClient } from "../../lib/apiClient";

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalServices: 0,
    totalContacts: 0,
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    recentActivity: [],
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await apiClient.get("/dashboard/stats");
        if (mounted) {
          setStats(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22C55E]">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Company Overview</h1>
        <p className="mt-2 text-sm text-slate-500">Monitor employee metrics and system status in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Projects" value={loading ? "..." : stats.totalProjects} icon={FolderKanban} colorClass="bg-blue-50 text-blue-600" />
        <StatCard label="Total Services" value={loading ? "..." : stats.totalServices} icon={Briefcase} colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard label="Total Contacts" value={loading ? "..." : stats.totalContacts} icon={Contact} colorClass="bg-violet-50 text-violet-600" />
        <StatCard label="Total Employees" value={loading ? "..." : stats.totalEmployees} icon={Users} colorClass="bg-slate-100 text-slate-600" />
        <StatCard label="Present Today" value={loading ? "..." : stats.presentToday} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="Pending Leaves" value={loading ? "..." : stats.pendingLeaves} icon={CalendarOff} colorClass="bg-amber-50 text-amber-600" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-blue-500" />
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        </div>
        
        <div className="mt-6 space-y-4">
          {loading && <p className="text-sm text-slate-500 animate-pulse">Loading activity feed...</p>}
          {!loading && stats.recentActivity.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-slate-50 p-4 mb-3">
                <FolderKanban className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500">No recent activity detected.</p>
            </div>
          )}
          {!loading &&
            stats.recentActivity.map((item) => (
              <article key={item._id} className="group relative flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                <div className="mt-0.5 rounded-full bg-white p-2 shadow-sm border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.message}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}
