import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Clock, CalendarDays, CheckCircle2, Download, Search, Filter, AlertCircle } from "lucide-react";
import { adminApiClient } from "../../lib/apiClient";

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({ from: "", to: "", search: "", status: "all" });
  const [data, setData] = useState({ records: [], summary: null });

  async function loadAttendance(nextFilters = filters) {
    setLoading(true);

    try {
      const { data: payload } = await adminApiClient.get("/attendance", { params: nextFilters });
      setData(payload);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await loadAttendance(filters);
  }

  async function handleExport() {
    setExporting(true);

    try {
      const response = await adminApiClient.get("/attendance/export", {
        params: filters,
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Attendance exported");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to export attendance");
    } finally {
      setExporting(false);
    }
  }

  const stats = {
    total: data.summary?.totalRecords || 0,
    completed: data.summary?.completedRecords || 0,
    hours: data.summary?.totalHours || 0,
    pending: Math.max((data.summary?.totalRecords || 0) - (data.summary?.completedRecords || 0), 0),
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22C55E]">Time Tracking</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Attendance Log</h1>
          <p className="mt-2 text-sm text-slate-500">Monitor employee hours, check-ins, and export complete reports.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition hover:bg-slate-50 disabled:opacity-70"
        >
          <Download className="h-4 w-4 text-slate-400" />
          {exporting ? "Preparing Export..." : "Export Excel"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Records" value={stats.total} icon={CalendarDays} colorClass="bg-blue-50 text-blue-600" />
        <StatCard label="Completed Shifts" value={stats.completed} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="Currently Active" value={stats.pending} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
        <StatCard label="Total Hours" value={stats.hours} icon={Users} colorClass="bg-purple-50 text-purple-600" />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col min-h-[500px]">
        
        {/* Horizontal Filter Bar */}
        <div className="border-b border-slate-100 p-4 sm:p-6 bg-slate-50/50 rounded-t-2xl">
          <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4 lg:flex-row lg:items-center">
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                placeholder="Search by name, ID or department..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">From</span>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">To</span>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Status</span>
                <select
                  value={filters.status}
                  onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                >
                  <option value="all">All</option>
                  <option value="present">Present (In Progress/Completed)</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters({ from: "", to: "", search: "", status: "all" });
                  loadAttendance({ from: "", to: "", search: "", status: "all" });
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Attendance Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-medium">Employee Name & ID</th>
                <th className="px-6 py-3.5 font-medium">Department</th>
                <th className="px-6 py-3.5 font-medium">Date Record</th>
                <th className="px-6 py-3.5 font-medium">Time In / Out</th>
                <th className="px-6 py-3.5 font-medium">Total Hours</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                      Loading records...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && data.records.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CalendarDays className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                    <p className="text-slate-600 font-medium">No attendance records found</p>
                    <p className="text-sm text-slate-400 mt-1">Try to adjust or clear your filter settings.</p>
                  </td>
                </tr>
              )}

              {!loading &&
                data.records.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-slate-50/60 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold uppercase">
                          {item.employee?.fullName?.charAt(0) || "-"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.employee?.fullName || "N/A"}</p>
                          <p className="text-xs text-slate-500" title="Employee Code">
                            <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500">{item.employee?.employeeCode || "N/A"}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{item.employee?.department || "-"}</p>
                      <p className="text-xs text-slate-500">{item.employee?.designation || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{item.dayKey}</p>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === "absent" ? (
                        <span className="text-slate-400 italic">No Activity Recorded</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            {item.checkInAt ? new Date(item.checkInAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "-"}
                          </span>
                          <span className="text-slate-300">→</span>
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            {item.checkOutAt ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                {new Date(item.checkOutAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-slate-400 italic">Expected</span>
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{item.totalHours || 0}</span> <span className="text-xs text-slate-500">hrs</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                          item.status === "absent"
                            ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                            : item.checkOutAt
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/20"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          item.status === "absent" ? "bg-red-500" : item.checkOutAt ? "bg-emerald-500" : "bg-amber-500"
                        }`} />
                        {item.status === "absent" ? "Absent" : item.checkOutAt ? "Completed" : "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
