import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminApiClient as apiClient } from "../../lib/apiClient";

const initialJobForm = {
  title: "",
  employmentType: "Full Time",
  location: "",
  description: "",
  status: "open",
};

function statusClass(status) {
  return status === "done"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700";
}

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [savingJob, setSavingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState("");
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [jobDeletingId, setJobDeletingId] = useState("");
  const [appUpdatingId, setAppUpdatingId] = useState("");
  const [appDeletingId, setAppDeletingId] = useState("");

  const isEditingJob = useMemo(() => Boolean(editingJobId), [editingJobId]);

  async function loadJobs() {
    setLoadingJobs(true);
    try {
      const { data } = await apiClient.get("/careers/jobs/admin");
      setJobs(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load openings");
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadApplications() {
    setLoadingApplications(true);
    try {
      const { data } = await apiClient.get("/careers/applications");
      setApplications(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoadingApplications(false);
    }
  }

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  function resetJobForm() {
    setEditingJobId("");
    setJobForm(initialJobForm);
  }

  function handleEditJob(item) {
    setEditingJobId(item._id);
    setJobForm({
      title: item.title || "",
      employmentType: item.employmentType || "Full Time",
      location: item.location || "",
      description: item.description || "",
      status: item.status || "open",
    });
  }

  async function handleJobSubmit(event) {
    event.preventDefault();

    if (!jobForm.title || !jobForm.location) {
      toast.error("Title and location are required");
      return;
    }

    setSavingJob(true);
    try {
      if (isEditingJob) {
        await apiClient.put(`/careers/jobs/${editingJobId}`, jobForm);
        toast.success("Opening updated");
      } else {
        await apiClient.post("/careers/jobs", jobForm);
        toast.success("Opening published");
      }

      resetJobForm();
      await loadJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save opening");
    } finally {
      setSavingJob(false);
    }
  }

  async function handleDeleteJob(jobId) {
    const confirmed = window.confirm("Delete this opening?");
    if (!confirmed) {
      return;
    }

    setJobDeletingId(jobId);
    try {
      await apiClient.delete(`/careers/jobs/${jobId}`);
      setJobs((prev) => prev.filter((item) => item._id !== jobId));
      toast.success("Opening deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete opening");
    } finally {
      setJobDeletingId("");
    }
  }

  async function handleApplicationStatus(applicationId, nextStatus) {
    setAppUpdatingId(applicationId);

    try {
      const { data } = await apiClient.patch(`/careers/applications/${applicationId}/status`, {
        status: nextStatus,
      });

      setApplications((prev) => prev.map((item) => (item._id === applicationId ? data : item)));
      toast.success(`Application marked as ${nextStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update application");
    } finally {
      setAppUpdatingId("");
    }
  }

  async function handleDeleteApplication(applicationId) {
    const confirmed = window.confirm("Delete this application permanently?");
    if (!confirmed) {
      return;
    }

    setAppDeletingId(applicationId);

    try {
      await apiClient.delete(`/careers/applications/${applicationId}`);
      setApplications((prev) => prev.filter((item) => item._id !== applicationId));
      toast.success("Application deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete application");
    } finally {
      setAppDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Careers</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Recruitment Management</h1>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{isEditingJob ? "Edit Opening" : "Publish Opening"}</h2>
        <form onSubmit={handleJobSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Job Title
            <input
              value={jobForm.title}
              onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Site Engineer"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Employment Type
            <input
              value={jobForm.employmentType}
              onChange={(e) => setJobForm((prev) => ({ ...prev, employmentType: e.target.value }))}
              placeholder="Full Time"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Location
            <input
              value={jobForm.location}
              onChange={(e) => setJobForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Ranchi"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              value={jobForm.status}
              onChange={(e) => setJobForm((prev) => ({ ...prev, status: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label className="md:col-span-2 block text-sm font-medium text-slate-700">
            Description
            <textarea
              rows={3}
              value={jobForm.description}
              onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional short job description"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={savingJob}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {savingJob ? "Saving..." : isEditingJob ? "Update Opening" : "Publish Opening"}
            </button>

            {isEditingJob && (
              <button type="button" onClick={resetJobForm} className="rounded-xl border border-slate-200 px-5 py-3 text-sm">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Published Openings</h2>

        {loadingJobs ? (
          <p className="mt-4 text-sm text-slate-500">Loading openings...</p>
        ) : jobs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No openings published yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {jobs.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.employmentType} • {item.location}
                    </p>
                    {item.description && <p className="mt-2 text-sm text-slate-600">{item.description}</p>}
                  </div>

                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
                      item.status === "open"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => handleEditJob(item)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={jobDeletingId === item._id}
                    onClick={() => handleDeleteJob(item._id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Submitted Applications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Candidate</th>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingApplications && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                    Loading applications...
                  </td>
                </tr>
              )}

              {!loadingApplications && applications.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                    No applications submitted yet.
                  </td>
                </tr>
              )}

              {!loadingApplications &&
                applications.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${statusClass(
                          item.status,
                        )}`}
                      >
                        {item.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-700">{item.jobTitle || item.job?.title || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.email}</td>
                    <td className="px-4 py-3 text-slate-700">{item.phone || "-"}</td>
                    <td className="max-w-[340px] px-4 py-3 text-slate-700">{item.experience}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(item.createdAt).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={appUpdatingId === item._id || appDeletingId === item._id}
                          onClick={() => handleApplicationStatus(item._id, "pending")}
                          className="rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          disabled={appUpdatingId === item._id || appDeletingId === item._id}
                          onClick={() => handleApplicationStatus(item._id, "done")}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          disabled={appDeletingId === item._id || appUpdatingId === item._id}
                          onClick={() => handleDeleteApplication(item._id)}
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
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
