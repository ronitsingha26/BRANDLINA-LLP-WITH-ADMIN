import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, XCircle, Search, Filter, CalendarDays, User } from "lucide-react";
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

export default function LeavesPage() {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [data, setData] = useState({ leaves: [], counts: { pending: 0, approved: 0, rejected: 0 } });

  async function loadLeaves(nextFilters = filters) {
    setLoading(true);

    try {
      const { data: payload } = await adminApiClient.get("/leaves", {
        params: nextFilters,
      });
      setData(payload);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  async function handleReview(item, status) {
    const note = window.prompt(`Add note for ${status} decision (optional)`, item.reviewNote || "") || "";

    setUpdatingId(item._id);

    try {
      await adminApiClient.patch(`/leaves/${item._id}/review`, {
        status,
        reviewNote: note,
      });
      toast.success(`Leave ${status}`);
      await loadLeaves(filters);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update leave status");
    } finally {
      setUpdatingId("");
    }
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await loadLeaves(filters);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22C55E]">Absence Management</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Leave Requests</h1>
        <p className="mt-2 text-sm text-slate-500">Review time-off requests, manage approvals, and track employee absences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Pending Approval" value={data.counts?.pending || 0} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
        <StatCard label="Approved Leaves" value={data.counts?.approved || 0} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="Rejected Requests" value={data.counts?.rejected || 0} icon={XCircle} colorClass="bg-red-50 text-red-600" />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col min-h-[500px]">
        {/* Horizontal Filter Bar */}
        <div className="border-b border-slate-100 p-4 sm:p-6 bg-slate-50/50 rounded-t-2xl">
          <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 max-w-md items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                  placeholder="Search employee or reason"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
              <select
                value={filters.status}
                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Crisp White Table */}
        <div className="flex-1 overflow-x-auto bg-white rounded-b-2xl">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100/80 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Leave Dates</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status & Note</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                      Loading requests...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && data.leaves.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CalendarDays className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                    <p className="text-slate-600 font-medium">No leave requests found</p>
                    <p className="text-sm text-slate-400 mt-1">Check back later or adjust filters</p>
                  </td>
                </tr>
              )}

              {!loading &&
                data.leaves.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-slate-50/40 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold uppercase">
                          {item.employee?.fullName?.charAt(0) || <User className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.employee?.fullName || "-"}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.employee?.employeeCode || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span>{new Date(item.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <span className="text-slate-300">→</span>
                        <span>{new Date(item.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[11px] ml-1">{item.totalDays}d</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700 capitalize">{item.leaveType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[200px] truncate text-slate-600" title={item.reason}>{item.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                            item.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : item.status === "rejected"
                                ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/20"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            item.status === "approved" ? "bg-emerald-500" : item.status === "rejected" ? "bg-red-500" : "bg-amber-500"
                          }`} />
                          {item.status}
                        </span>
                        {item.reviewNote && (
                          <p className="text-[11px] text-slate-500 max-w-[180px] truncate" title={item.reviewNote}>
                            Note: {item.reviewNote}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={updatingId === item._id}
                            onClick={() => handleReview(item, "approved")}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === item._id}
                            onClick={() => handleReview(item, "rejected")}
                            className="inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Reviewed</span>
                      )}
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
