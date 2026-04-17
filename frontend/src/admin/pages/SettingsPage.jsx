import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApiClient as apiClient } from "../../lib/apiClient";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: "",
    supportEmail: "",
    contactPhone: "",
    address: "",
    aboutHeroKicker: "",
    aboutHeroTitle: "",
    aboutHeroRoute: "",
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await apiClient.get("/settings");
        if (mounted) {
          setForm({
            siteName: data.siteName || "",
            supportEmail: data.supportEmail || "",
            contactPhone: data.contactPhone || "",
            address: data.address || "",
            aboutHeroKicker: data.aboutHeroKicker || "About",
            aboutHeroTitle: data.aboutHeroTitle || "Our Story, Standards and Discipline",
            aboutHeroRoute: data.aboutHeroRoute || "Company",
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load settings");
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

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!form.siteName || !form.supportEmail) {
      toast.error("Site name and support email are required");
      return;
    }

    setSaving(true);
    try {
      await apiClient.put("/settings", form);
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Global Configuration</h1>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading settings...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Site Name
              <input
                name="siteName"
                value={form.siteName}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Support Email
              <input
                type="email"
                name="supportEmail"
                value={form.supportEmail}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Contact Phone
              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Address
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              About Hero Kicker
              <input
                name="aboutHeroKicker"
                value={form.aboutHeroKicker}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              About Hero Route Label
              <input
                name="aboutHeroRoute"
                value={form.aboutHeroRoute}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              About Hero Title
              <input
                name="aboutHeroTitle"
                value={form.aboutHeroTitle}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || loading}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
