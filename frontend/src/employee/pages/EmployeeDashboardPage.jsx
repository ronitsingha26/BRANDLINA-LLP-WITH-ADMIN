import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { employeeApiClient } from "../../lib/apiClient";

function MetricCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </article>
  );
}

export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const { data: payload } = await employeeApiClient.get("/erp/dashboard/employee");
        if (mounted) {
          setData(payload);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load employee dashboard");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#eef9f1] p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#16a34a]">Employee Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Welcome, {data?.profile?.fullName || "Employee"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Review today’s status, monthly attendance, and pending leave requests from a clean overview.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Today status</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Attendance summary</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Leave summary</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="This Month Attendance Days" value={loading ? "..." : data?.monthAttendance?.totalDays || 0} />
        <MetricCard label="This Month Hours" value={loading ? "..." : data?.monthAttendance?.totalHours || 0} />
        <MetricCard label="Pending Leave Requests" value={loading ? "..." : data?.leaves?.pending || 0} />
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Today Status</h2>
            <p className="mt-1 text-sm text-slate-500">See your check-in status and current progress.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
            {loading ? "Loading..." : data?.today?.dayKey || "Today"}
          </span>
        </div>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading today attendance...</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Check In</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {data?.today?.checkInAt ? new Date(data.today.checkInAt).toLocaleTimeString("en-IN") : "Not checked in"}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Check Out</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {data?.today?.checkOutAt ? new Date(data.today.checkOutAt).toLocaleTimeString("en-IN") : "Not checked out"}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Today Hours</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{data?.today?.totalHours || 0}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {data?.today?.checkOutAt ? "Present" : data?.today?.checkInAt ? "Working" : "Not checked-in"}
              </p>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}
