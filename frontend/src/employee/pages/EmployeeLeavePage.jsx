import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { employeeApiClient } from "../../lib/apiClient";

const initialForm = {
  leaveType: "casual",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function EmployeeLeavePage() {
  const [form, setForm] = useState(initialForm);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadLeaves() {
    setLoading(true);

    try {
      const { data } = await employeeApiClient.get("/leaves/my");
      setLeaves(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);

    try {
      await employeeApiClient.post("/leaves/apply", form);
      toast.success("Leave request submitted");
      setForm(initialForm);
      await loadLeaves();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply leave");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#eef9f1] p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#16a34a]">Leaves</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Apply Leave</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Submit a leave request and review your previous leave history from a clean, minimal layout.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Simple leave form</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Leave history</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] items-start">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">New Request</h2>
            <p className="mt-1 text-sm text-slate-500">Fill in the leave details and submit for review.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <label className="block text-sm font-medium text-slate-700">
              Leave Type
              <select
                value={form.leaveType}
                onChange={(event) => setForm((prev) => ({ ...prev, leaveType: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              >
                <option value="casual">Casual</option>
                <option value="sick">Sick</option>
                <option value="earned">Earned</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-slate-700">
                Start Date
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                End Date
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Reason
              <textarea
                rows={3}
                value={form.reason}
                onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                placeholder="Reason for leave"
              />
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.22)] transition hover:shadow-[0_14px_34px_rgba(37,99,235,0.28)] disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Apply Leave"}
              </button>
            </div>
          </form>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Leave History</h2>
              <p className="mt-1 text-sm text-slate-500">Track the status of submitted leave requests.</p>
            </div>
            <p className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              {loading ? "Loading..." : `${leaves.length} requests`}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="max-h-[620px] overflow-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Start</th>
                    <th className="px-4 py-3 font-semibold">End</th>
                    <th className="px-4 py-3 font-semibold">Days</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        Loading leave requests...
                      </td>
                    </tr>
                  )}

                  {!loading && leaves.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        No leave requests found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    leaves.map((item) => (
                      <tr key={item._id} className="border-t border-slate-100 transition hover:bg-slate-50/80">
                        <td className="px-4 py-4 capitalize text-slate-700">{item.leaveType}</td>
                        <td className="px-4 py-4 text-slate-700">{new Date(item.startDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-4 text-slate-700">{new Date(item.endDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-4 text-slate-700">{item.totalDays}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
                              item.status === "approved"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : item.status === "rejected"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="max-w-[320px] px-4 py-4 text-slate-700 truncate" title={item.reason}>{item.reason}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
