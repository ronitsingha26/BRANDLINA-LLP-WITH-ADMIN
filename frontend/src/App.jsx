import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import AdminLayout from "./admin/AdminLayout";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import EmployeeLayout from "./employee/EmployeeLayout";
import ProtectedEmployeeRoute from "./employee/ProtectedEmployeeRoute";

// ── Public ───────────────────────────────────────────────
const Home          = lazy(() => import("./pages/Home"));
const About         = lazy(() => import("./pages/About"));
const Services      = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Projects      = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Industries    = lazy(() => import("./pages/Industries"));
const Careers       = lazy(() => import("./pages/Careers"));
const Contact       = lazy(() => import("./pages/Contact"));
const NotFound      = lazy(() => import("./pages/NotFound"));

// ── Admin ────────────────────────────────────────────────
const LandingPage    = lazy(() => import("./admin/pages/LandingPage"));
const DashboardPage  = lazy(() => import("./admin/pages/DashboardPage"));
const HomepagePage   = lazy(() => import("./admin/pages/HomepagePage"));
const ServicesPage   = lazy(() => import("./admin/pages/ServicesPage"));
const ProjectsPage   = lazy(() => import("./admin/pages/ProjectsPage"));
const CareersPage    = lazy(() => import("./admin/pages/CareersPage"));
const ContactsPage   = lazy(() => import("./admin/pages/ContactsPage"));
const EmployeesPage  = lazy(() => import("./admin/pages/EmployeesPage"));
const AttendancePage = lazy(() => import("./admin/pages/AttendancePage"));
const LeavesPage     = lazy(() => import("./admin/pages/LeavesPage"));
const SettingsPage   = lazy(() => import("./admin/pages/SettingsPage"));
// ── Employee ─────────────────────────────────────────────
const EmployeeLogin          = lazy(() => import("./pages/EmployeeLogin"));
const EmployeeDashboardPage  = lazy(() => import("./employee/pages/EmployeeDashboardPage"));
const EmployeeAttendancePage = lazy(() => import("./employee/pages/EmployeeAttendancePage"));
const EmployeeLeavePage      = lazy(() => import("./employee/pages/EmployeeLeavePage"));

function PublicLayout() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </Layout>
  );
}

function DelayedRedirect({ to, delay = 1000 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(to, { replace: true });
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delay, navigate, to]);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f0eb] px-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(194,183,162,0.18),transparent_42%)]" />
      <Motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center"
      >
        <Motion.div
          className="h-16 w-16 rounded-full border-2 border-[#d7e8de] border-t-[#355f1f]"
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{ rotate: { duration: 1, ease: "linear", repeat: Infinity }, scale: { duration: 1, ease: "easeInOut", repeat: Infinity } }}
        />
      </Motion.div>
    </Motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* ── ADMIN AUTH ─────────────────────────────── */}
          <Route path="/cms-portal-entry" element={<DelayedRedirect to="/admin-login" />} />
          <Route path="/admin-login" element={<LandingPage />} />
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />

          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin/cms" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/cms/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="homepage" element={<HomepagePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="leaves" element={<LeavesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Legacy CMS paths — preserve structure */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin/cms/dashboard" replace />} />
            <Route path="/admin/homepage" element={<Navigate to="/admin/cms/homepage" replace />} />
            <Route path="/admin/services" element={<Navigate to="/admin/cms/services" replace />} />
            <Route path="/admin/projects" element={<Navigate to="/admin/cms/projects" replace />} />
            <Route path="/admin/careers" element={<Navigate to="/admin/cms/careers" replace />} />
            <Route path="/admin/contacts" element={<Navigate to="/admin/cms/contacts" replace />} />
            <Route path="/admin/employees" element={<Navigate to="/admin/cms/employees" replace />} />
            <Route path="/admin/attendance" element={<Navigate to="/admin/cms/attendance" replace />} />
            <Route path="/admin/leaves" element={<Navigate to="/admin/cms/leaves" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/cms/settings" replace />} />
          </Route>

          <Route path="/admin/*" element={<Navigate to="/admin-login" replace />} />

          {/* ── EMPLOYEE AUTH ─────────────────────────── */}
          <Route path="/employee-login-entry" element={<DelayedRedirect to="/employee-login" />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route element={<ProtectedEmployeeRoute />}>
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboardPage />} />
              <Route path="attendance" element={<EmployeeAttendancePage />} />
              <Route path="leave" element={<EmployeeLeavePage />} />
            </Route>
          </Route>

          {/* ── PUBLIC WEBSITE ────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/"              element={<Home />} />
            <Route path="/about"         element={<About />} />
            <Route path="/services"      element={<Services />} />
            <Route path="/services/:id"  element={<ServiceDetail />} />
            <Route path="/projects"      element={<Projects />} />
            <Route path="/projects/:id"  element={<ProjectDetail />} />
            <Route path="/industries"    element={<Industries />} />
            <Route path="/careers"       element={<Careers />} />
            <Route path="/contact"       element={<Contact />} />
            <Route path="*"              element={<NotFound />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
