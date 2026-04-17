import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEmployeeAuth } from "../employee/EmployeeAuthContext";
import { BrandLogo } from "../components/common/BrandLogo";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useEmployeeAuth();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/employee/dashboard";

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.identifier.trim() || !form.password.trim()) {
      toast.error("Employee ID/email and password are required");
      return;
    }

    setSubmitting(true);

    try {
      await login({ identifier: form.identifier, password: form.password });
      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid employee credentials");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f2f0eb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(194,183,162,0.18),transparent_42%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[560px] items-center">
        <section className="w-full rounded-[30px] border border-[#e3ddd2] bg-[#fbfaf7] px-6 py-8 shadow-[0_22px_70px_rgba(17,24,39,0.1)] sm:px-10 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <BrandLogo variant="auth" className="h-[92px] max-w-[360px]" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#6f6656]">Employee Login Portal</p>
            <h1 className="mt-3 text-[2.05rem] font-bold leading-tight text-[#111111]">Welcome back!</h1>
            <p className="mt-2 text-[1rem] text-[#202020]">Enter your employee ID and password to access your portal</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5 text-left">
            <label className="block text-sm font-semibold text-[#1d1d1d]">
              Employee ID / Email
              <input
                value={form.identifier}
                onChange={(event) => setForm((prev) => ({ ...prev, identifier: event.target.value }))}
                className="mt-2 w-full rounded-[10px] border border-[#d0d0d0] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#325f1f] focus:ring-2 focus:ring-[#325f1f]/20"
                placeholder="Enter your employee ID or email"
                autoComplete="username"
              />
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-[#1d1d1d]">Password</label>
                <button
                  type="button"
                  className="text-xs font-medium text-[#2b58c6] transition hover:text-[#1f45a3]"
                >
                  forgot password
                </button>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-[10px] border border-[#d0d0d0] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition focus:border-[#325f1f] focus:ring-2 focus:ring-[#325f1f]/20"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[12px] bg-[#355f1f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#2f541b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <Link to="/" className="mt-8 inline-block text-sm font-medium text-[#2b58c6] hover:text-[#1f45a3]">
            Back to website
          </Link>
        </section>
      </div>
    </div>
  );
}
