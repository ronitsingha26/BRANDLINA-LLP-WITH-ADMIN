import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminApiClient as apiClient } from "../../lib/apiClient";

const initialForm = {
  name: "",
  category: "",
  location: "",
  description: "",
  outcome: "",
  date: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  async function loadProjects() {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/projects");
      setProjects(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setFiles([]);
    setPreviews([]);
    setExistingImages([]);
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      name: item.name || item.title || "",
      category: item.category || "",
      location: item.location || "",
      description: item.description || "",
      outcome: item.outcome || "",
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : "",
    });
    setExistingImages(item.images || item.gallery || []);
    setFiles([]);
    setPreviews([]);
  }

  function handleFileChange(event) {
    const selected = Array.from(event.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  }

  function removeExistingImage(target) {
    setExistingImages((prev) => prev.filter((url) => url !== target));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.description) {
      toast.error("Project name and description are required");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("category", form.category);
      payload.append("location", form.location);
      payload.append("description", form.description);
      payload.append("outcome", form.outcome);
      payload.append("date", form.date);
      payload.append("keepImages", JSON.stringify(existingImages));

      files.forEach((file) => payload.append("images", file));

      if (isEditing) {
        await apiClient.put(`/projects/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Project updated");
      } else {
        await apiClient.post("/projects", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Project created");
      }

      resetForm();
      await loadProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      await apiClient.delete(`/projects/${id}`);
      toast.success("Project deleted");
      await loadProjects();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete project");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Projects</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Projects Management</h1>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{isEditing ? "Edit Project" : "Create Project"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Project Name" className="rounded-xl border border-slate-200 px-4 py-3" />
          <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" className="rounded-xl border border-slate-200 px-4 py-3" />
          <input value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3" />
          <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3" />

          <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" rows={4} className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3" />
          <textarea value={form.outcome} onChange={(e) => setForm((prev) => ({ ...prev, outcome: e.target.value }))} placeholder="Outcome" rows={2} className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3" />

          <label className="md:col-span-2 text-sm text-slate-600">
            Upload Images (multiple)
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-2 block w-full" />
          </label>

          {existingImages.length > 0 && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-slate-700">Existing Images</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {existingImages.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="Existing" className="h-24 w-full rounded-lg border border-slate-200 object-cover" />
                    <button type="button" onClick={() => removeExistingImage(url)} className="absolute right-1 top-1 rounded bg-white/90 px-2 py-1 text-xs text-red-600">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previews.length > 0 && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-slate-700">New Upload Preview</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {previews.map((url, index) => (
                  <img key={`${url}-${index}`} src={url} alt="Preview" className="h-24 w-full rounded-lg border border-slate-200 object-cover" />
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70">
              {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-5 py-3 text-sm">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Project List</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading projects...</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {projects.map((item) => (
              <article key={item._id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  {item.cover ? (
                    <img src={item.cover} alt={item.name || item.title} className="h-14 w-20 rounded-lg border border-slate-200 object-cover" />
                  ) : (
                    <span className="inline-flex h-14 w-20 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500">No image</span>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{item.name || item.title}</p>
                    <p className="text-xs uppercase text-slate-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEdit(item)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">Edit</button>
                  <button type="button" onClick={() => handleDelete(item._id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
