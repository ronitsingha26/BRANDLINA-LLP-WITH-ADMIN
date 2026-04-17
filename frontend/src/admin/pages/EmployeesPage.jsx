import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Users, UserPlus, Search, Filter, ShieldCheck, UserX, Briefcase, Mail, Phone, Hash } from "lucide-react";
import { adminApiClient } from "../../lib/apiClient";

const initialForm = {
  employeeCode: "",
  fullName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
  employmentType: "full-time",
  password: "",
};

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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  async function loadEmployees(nextSearch = "") {
    setLoading(true);

    try {
      const { data } = await adminApiClient.get("/employees", {
        params: nextSearch ? { search: nextSearch } : {},
      });
      setEmployees(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function resetForm() {
    setEditingId("");
    setForm(initialForm);
    setIsFormOpen(false);
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setIsFormOpen(true);
    setForm({
      employeeCode: item.employeeCode || "",
      fullName: item.fullName || "",
      email: item.email || "",
      phone: item.phone || "",
      department: item.department || "",
      designation: item.designation || "",
      joiningDate: item.joiningDate ? new Date(item.joiningDate).toISOString().slice(0, 10) : "",
      employmentType: item.employmentType || "full-time",
      password: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.employeeCode || !form.fullName || !form.email || !form.department || !form.designation || !form.joiningDate) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isEditing && !form.password) {
      toast.error("Password is required for new employees");
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        await adminApiClient.put(`/employees/${editingId}`, form);
        toast.success("Employee updated");
      } else {
        await adminApiClient.post("/employees", form);
        toast.success("Employee created");
      }

      resetForm();
      await loadEmployees(search);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save employee");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusToggle(item) {
    try {
      await adminApiClient.patch(`/employees/${item._id}/status`, { isActive: !item.isActive });
      toast.success(item.isActive ? "Employee deactivated" : "Employee activated");
      await loadEmployees(search);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update employee status");
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete ${item.fullName}?`)) {
      return;
    }

    try {
      await adminApiClient.delete(`/employees/${item._id}`);
      toast.success("Employee deleted");
      await loadEmployees(search);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete employee");
    }
  }

  async function onSearchSubmit(event) {
    event.preventDefault();
    await loadEmployees(search);
  }

  const stats = {
    total: employees.length,
    active: employees.filter((item) => item.isActive).length,
    inactive: employees.filter((item) => !item.isActive).length,
    managers: employees.filter((item) => /manager|lead|head/i.test(`${item.designation || ""} ${item.department || ""}`)).length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22C55E]">Workforce Management</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Employees Directory</h1>
        <p className="mt-2 text-sm text-slate-500">Manage personnel, roles, and platform access control.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Staff" value={stats.total} icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <StatCard label="Active Accounts" value={stats.active} icon={ShieldCheck} colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="Inactive Accounts" value={stats.inactive} icon={UserX} colorClass="bg-amber-50 text-amber-600" />
        <StatCard label="Managers / Leads" value={stats.managers} icon={Briefcase} colorClass="bg-slate-100 text-slate-600" />
      </div>

      <section className={`grid gap-8 items-start ${isFormOpen ? "lg:grid-cols-[380px_1fr]" : "grid-cols-1"}`}>
        
        {/* LEFT: ADD EMPLOYEE FORM */}
        {isFormOpen && (
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm h-fit sticky top-6">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <UserPlus className="h-5 w-5 text-emerald-600" />
                {isEditing ? "Edit Profile" : "Add New Employee"}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <UserX className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">Fill in the primary details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Basic Info Group */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Basic Information</h3>
              
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Hash className="h-3.5 w-3.5 text-slate-400" /> Employee Code *
                </label>
                <input
                  value={form.employeeCode}
                  onChange={(event) => setForm((prev) => ({ ...prev, employeeCode: event.target.value }))}
                  placeholder="e.g. EMP-001"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Full Name *</label>
                <input
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address *
                </label>
                <input
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="john@brandlina.com"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="+91 00000 00000"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Job Info Group */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Employment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Department *</label>
                  <input
                    value={form.department}
                    onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                    placeholder="Engineering"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Designation *</label>
                  <input
                    value={form.designation}
                    onChange={(event) => setForm((prev) => ({ ...prev, designation: event.target.value }))}
                    placeholder="Senior Dev"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Joining Date *</label>
                  <input
                    type="date"
                    value={form.joiningDate}
                    onChange={(event) => setForm((prev) => ({ ...prev, joiningDate: event.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Type</label>
                  <select
                    value={form.employmentType}
                    onChange={(event) => setForm((prev) => ({ ...prev, employmentType: event.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-medium text-slate-700">Account Password {isEditing ? "(Optional)" : "*"}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder={isEditing ? "Leave blank to keep same" : "Set a secure password"}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Employee"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>
        )}

        {/* RIGHT: EMPLOYEE LIST */}
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-fit">
          <div className="border-b border-slate-100 px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Employee List</h2>
            
            <div className="flex flex-1 max-w-md items-center gap-3 sm:justify-end">
              <form onSubmit={onSearchSubmit} className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white"
                  />
                </div>
                <button type="submit" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                  Search
                </button>
              </form>
              {!isFormOpen && (
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 flex items-center gap-2 whitespace-nowrap shadow-sm"
                >
                  <UserPlus className="h-4 w-4" /> Add
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Employee</th>
                  <th className="px-6 py-3.5 font-medium">Role & Department</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Loading employees...
                    </td>
                  </tr>
                )}

                {!loading && employees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Users className="mx-auto h-8 w-8 text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium">No employees found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                )}

                {!loading &&
                  employees.map((item) => (
                    <tr key={item._id} className="group transition-colors hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase">
                            {item.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.fullName}</p>
                            <p className="text-xs text-slate-500">{item.employeeCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{item.designation}</p>
                        <p className="text-xs text-slate-500">{item.department}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                            item.isActive
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(item)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              item.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {item.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
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
        </article>
      </section>
    </div>
  );
}
