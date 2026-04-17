import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApiClient as apiClient } from "../../lib/apiClient";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  function getInquiryLabel(value) {
    return value === "book_call" ? "Book a Call" : "Contact";
  }

  function getSourceLabel(value) {
    if (value === "home_cta") {
      return "Home Get in Touch";
    }

    if (value === "contact_page") {
      return "Contact Page";
    }

    return value || "-";
  }

  function getStatusLabel(status) {
    return status === "done" ? "Done" : "Pending";
  }

  async function handleStatusChange(contactId, nextStatus) {
    setUpdatingId(contactId);

    try {
      const { data } = await apiClient.patch(`/contacts/${contactId}/status`, { status: nextStatus });

      setContacts((prev) => prev.map((item) => (item._id === contactId ? data : item)));
      toast.success(`Lead marked as ${nextStatus}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update lead status");
    } finally {
      setUpdatingId("");
    }
  }

  async function handleDelete(contactId) {
    const confirmed = window.confirm("Delete this lead permanently?");
    if (!confirmed) {
      return;
    }

    setDeletingId(contactId);

    try {
      await apiClient.delete(`/contacts/${contactId}`);
      setContacts((prev) => prev.filter((item) => item._id !== contactId));
      toast.success("Lead deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete lead");
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await apiClient.get("/contacts");
        if (mounted) {
          setContacts(data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load contacts");
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
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Contacts</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Submitted Leads</h1>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Message</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-slate-500">
                    Loading contacts...
                  </td>
                </tr>
              )}

              {!loading && contacts.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-slate-500">
                    No contacts submitted yet.
                  </td>
                </tr>
              )}

              {!loading &&
                contacts.map((contact) => (
                  <tr key={contact._id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 text-slate-700">
                      <span className="inline-flex rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-slate-700">
                        {getInquiryLabel(contact.inquiryType)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
                          (contact.status || "pending") === "done"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {getStatusLabel(contact.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{contact.name}</td>
                    <td className="px-4 py-3 text-slate-700">{contact.email}</td>
                    <td className="px-4 py-3 text-slate-700">{contact.company || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{contact.phone || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{contact.message}</td>
                    <td className="px-4 py-3 text-slate-700">{getSourceLabel(contact.sourcePage)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(contact.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={updatingId === contact._id || deletingId === contact._id}
                          onClick={() => handleStatusChange(contact._id, "pending")}
                          className="rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === contact._id || deletingId === contact._id}
                          onClick={() => handleStatusChange(contact._id, "done")}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === contact._id || updatingId === contact._id}
                          onClick={() => handleDelete(contact._id)}
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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
