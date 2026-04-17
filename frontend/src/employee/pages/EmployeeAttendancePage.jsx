import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { employeeApiClient } from "../../lib/apiClient";

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function EmployeeAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [attendance, setAttendance] = useState({ records: [], summary: null });

  const todayKey = dayKeyFormatter.format(new Date());

  const todayRecord = useMemo(
    () => attendance.records.find((item) => item.dayKey === todayKey),
    [attendance.records, todayKey],
  );

  const canCheckIn = !todayRecord;
  const canCheckOut = Boolean(todayRecord && !todayRecord.checkOutAt);

  async function loadAttendance() {
    setLoading(true);
    try {
      const { data } = await employeeApiClient.get("/attendance/my");
      setAttendance(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  async function handleCheckIn() {
    setBusy(true);
    try {
      await employeeApiClient.post("/attendance/check-in");
      toast.success("Check-in recorded");
      await loadAttendance();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to check in");
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckOut() {
    setBusy(true);
    try {
      await employeeApiClient.post("/attendance/check-out");
      toast.success("Check-out recorded");
      await loadAttendance();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to check out");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#eef9f1] p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#16a34a]">Attendance</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">My Attendance</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Check in, check out, and review today’s logs from a cleaner employee dashboard layout.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">One check-in per day</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Secure time logs</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Today Action</h2>
            <p className="mt-1 text-sm text-slate-500">{todayKey}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy || !canCheckIn}
              onClick={handleCheckIn}
              className="rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(34,197,94,0.22)] transition hover:shadow-[0_14px_34px_rgba(34,197,94,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Check In
            </button>
            <button
              type="button"
              disabled={busy || !canCheckOut}
              onClick={handleCheckOut}
              className="rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.22)] transition hover:shadow-[0_14px_34px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Check Out
            </button>
          </div>

          {todayRecord && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Check In</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{new Date(todayRecord.checkInAt).toLocaleTimeString("en-IN")}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Check Out</p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {todayRecord.checkOutAt ? new Date(todayRecord.checkOutAt).toLocaleTimeString("en-IN") : "Pending"}
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Hours</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{todayRecord.totalHours || 0}</p>
              </article>
            </div>
          )}
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading summary...</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Total Records</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{attendance.summary?.totalRecords || 0}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Completed</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{attendance.summary?.completedRecords || 0}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Hours</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{attendance.summary?.totalHours || 0}</p>
              </article>
            </div>
          )}
        </article>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Check In</th>
                <th className="px-4 py-3 font-semibold">Check Out</th>
                <th className="px-4 py-3 font-semibold">Hours</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading attendance records...
                  </td>
                </tr>
              )}

              {!loading && attendance.records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              )}

              {!loading &&
                attendance.records.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100 transition hover:bg-slate-50/80">
                    <td className="px-4 py-4 text-slate-800">{item.dayKey}</td>
                    <td className="px-4 py-4 text-slate-700">{new Date(item.checkInAt).toLocaleTimeString("en-IN")}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {item.checkOutAt ? new Date(item.checkOutAt).toLocaleTimeString("en-IN") : "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{item.totalHours || 0}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
                          item.checkOutAt
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.checkOutAt ? "Completed" : "Checked-in"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
