import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { BrandLogo } from "../common/BrandLogo";

export function Navbar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "About", path: "/about" },
    { name: "Career", path: "/careers" },
  ];

  return (
    <>
      <Motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 w-full border-b transition-[background,box-shadow,backdrop-filter] duration-300 ${scrolled
          ? "border-[rgba(30,64,175,0.1)] bg-white/75 shadow-[0_12px_40px_-12px_rgba(30,64,175,0.12)] backdrop-blur-xl"
          : "border-slate-200/80 bg-white/90 backdrop-blur-md"
          }`}
      >
        <div className="page-container flex h-[72px] items-center justify-between sm:h-[80px] lg:h-[88px]">
          <Link
            to="/"
            className="inline-flex items-center transition-opacity duration-300 hover:opacity-90"
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandLogo variant="navbar" />
          </Link>

          <nav className="hidden items-center gap-10 xl:flex">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link-premium ${isActive ? "is-active" : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Link
              to="/employee-login-entry"
              className="inline-flex items-center justify-center rounded-full border border-[#1e40af]/25 px-5 py-3 text-sm font-semibold text-[#1e40af] transition-colors hover:bg-blue-50"
            >
              Employee Login
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.3)] transition-transform hover:scale-[1.02]"
            >
              <span className="h-2 w-2 rounded-full bg-[#14b8a6]" /> Contact Us Now
              <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white text-[var(--accent)]">
                ↗
              </span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-[#1e293b] shadow-sm transition-colors hover:border-[#2563eb]/30 sm:h-11 sm:w-11 sm:text-xl xl:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </Motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <Motion.button
              type="button"
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[65] bg-[#1e293b]/25 backdrop-blur-[2px] xl:hidden"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <Motion.aside
              key="nav-drawer"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 right-0 z-[70] w-[min(100%,320px)] border-l border-slate-200/90 bg-white/95 p-6 shadow-[-12px_0_48px_rgba(30,64,175,0.12)] backdrop-blur-xl xl:hidden"
            >
              <nav className="mt-16 flex flex-col gap-1">
                {links.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${isActive
                        ? "bg-gradient-to-r from-[rgba(37,99,235,0.1)] to-[rgba(20,184,166,0.08)] font-bold text-[#1e40af]"
                        : "text-[#64748b] hover:bg-slate-50 hover:text-[#1e293b]"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              <Link
                to="/employee-login-entry"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#1e40af]/30 px-6 py-3.5 text-sm font-semibold text-[#1e40af]"
              >
                Employee Login
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
              >
                Contact Us Now ↗
              </Link>
            </Motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
