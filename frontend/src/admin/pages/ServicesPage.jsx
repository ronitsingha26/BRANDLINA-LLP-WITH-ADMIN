import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminApiClient as apiClient } from "../../lib/apiClient";

const initialForm = {
  title: "",
  category: "",
  excerpt: "",
  description: "",
  features: "",
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  async function loadServices() {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/services");
      setServices(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
    setPreview("");
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      category: item.category || "",
      excerpt: item.excerpt || "",
      description: item.description || "",
      features: (item.features || []).join(", "),
    });
    setPreview(item.image || "");
    setImageFile(null);
  }

  function onFileChange(event) {
    const file = event.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("category", form.category);
      payload.append("excerpt", form.excerpt);
      payload.append("description", form.description);
      payload.append("features", form.features);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (isEditing) {
        await apiClient.put(`/services/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service updated");
      } else {
        await apiClient.post("/services", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service created");
      }

      resetForm();
      await loadServices();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this service?")) {
      return;
    }

    try {
      await apiClient.delete(`/services/${id}`);
      toast.success("Service deleted");
      await loadServices();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete service");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Services</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Services Management</h1>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{isEditing ? "Edit Service" : "Create Service"}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Title"
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            placeholder="Category"
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Short excerpt"
            className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3"
            rows={2}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3"
            rows={4}
          />
          <input
            value={form.features}
            onChange={(e) => setForm((prev) => ({ ...prev, features: e.target.value }))}
            placeholder="Features (comma separated)"
            className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3"
          />

          <label className="md:col-span-2 text-sm text-slate-600">
            Upload image
            <input type="file" accept="image/*" onChange={onFileChange} className="mt-2 block w-full" />
          </label>

          {preview && (
            <img src={preview} alt="Preview" className="md:col-span-2 h-44 w-full rounded-xl border border-slate-200 object-cover" />
          )}

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70">
              {saving ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
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
        <h2 className="text-lg font-semibold text-slate-900">Service List</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading services...</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {services.map((item) => (
              <article key={item._id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-14 w-20 rounded-lg border border-slate-200 object-cover" />
                  ) : (
                    <span className="inline-flex h-14 w-20 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500">
                      No image
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs uppercase text-slate-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEdit(item)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item._id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
