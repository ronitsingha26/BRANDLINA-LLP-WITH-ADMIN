import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../common/BrandLogo";
import { fetchSettings } from "../../lib/publicApi";

const fallbackSettings = {
  siteName: "BRANDLINA LLP",
  supportEmail: "brandlina33@gmail.com",
  contactPhone: "+91 76679 26063",
  address: "Ranchi, Jharkhand",
};

export function Footer() {
  const [settings, setSettings] = useState(fallbackSettings);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchSettings();
        if (mounted && data) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // Keep static fallback settings.
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="w-full border-t border-[rgba(30,64,175,0.1)] bg-gradient-to-b from-white to-[#f8fafc] text-[#64748b]">
      <div className="page-container grid gap-10 border-b border-slate-200/80 py-12 md:grid-cols-2 md:gap-12 md:py-16 xl:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center mb-6">
            <BrandLogo variant="footer" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-text-muted">
            Complete turnkey technology partner for surveillance, fire systems, networking,
            HVAC and infrastructure execution.
          </p>
          <div className="mt-5 flex flex-col gap-3 text-[14px]">
            <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`} className="transition-colors hover:text-[var(--accent)]">
              {settings.contactPhone}
            </a>
            <a href={`mailto:${settings.supportEmail}`} className="transition-colors hover:text-[var(--accent)]">
              {settings.supportEmail}
            </a>
          </div>
        </div>

        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-[#1e293b]">Company</p>
          <div className="flex flex-col gap-4 text-[14px]">
            <Link to="/about" className="transition-colors hover:text-[var(--accent)]">
              About
            </Link>
            <Link to="/services" className="transition-colors hover:text-[var(--accent)]">
              Services
            </Link>
            <Link to="/projects" className="transition-colors hover:text-[var(--accent)]">
              Projects
            </Link>
            <Link to="/careers" className="transition-colors hover:text-[var(--accent)]">
              Careers
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-[#1e293b]">Registered Office</p>
          <p className="max-w-xs text-[14px] leading-relaxed">
            E type 196, HEC Dhurwa Sector-2
            <br />
            Dhurwa, Ranchi, Jharkhand (834004)
          </p>

          <p className="mt-3 max-w-xs text-[13px] text-text-muted">
            Preferred correspondence: {settings.address}
          </p>
          
          <p className="mb-6 mt-8 text-xs font-semibold uppercase tracking-wider text-[#1e293b]">Corporate Office</p>
          <p className="max-w-xs text-[14px] leading-relaxed">
            207/A Nandan enclave Tupudana
            <br />
            Ranchi Jharkhand (835221)
          </p>
        </div>

        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-[#1e293b]">Contact Info</p>
          <div className="flex flex-col gap-4 text-[14px]">
            <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`} className="transition-colors hover:text-[var(--accent)]">
              {settings.contactPhone}
            </a>
            <a href="tel:+919546628385" className="transition-colors hover:text-[var(--accent)]">
              +91 95466 28385
            </a>
            <a href={`mailto:${settings.supportEmail}`} className="transition-colors hover:text-[var(--accent)]">
              {settings.supportEmail}
            </a>
          </div>
        </div>
      </div>

      <div className="page-container grid gap-3 py-6 text-[13px] text-center sm:grid-cols-3 sm:items-center">
        <p className="sm:text-left">© {currentYear} {settings.siteName}. All Rights Reserved.</p>
        <p className="font-medium text-[#475569]">Designed and Developed by BN IntelHub Pvt. Ltd.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
          <Link to="/" className="transition-colors hover:text-[var(--accent)]">Privacy Policy</Link>
          <Link to="/" className="transition-colors hover:text-[var(--accent)]">Terms of Service</Link>
          <Link to="/cms-portal-entry" className="transition-colors hover:text-[var(--accent)]">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
