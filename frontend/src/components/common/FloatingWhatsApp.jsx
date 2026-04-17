import { useEffect, useState } from "react";

export function FloatingWhatsApp() {
  const [hideOnFooter, setHideOnFooter] = useState(false);
  const message = encodeURIComponent("Hello BRANDLINA LLP, I need a turnkey technology solution.");
  const href = `https://wa.me/917667926063?text=${message}`;

  useEffect(() => {
    const footerEl = document.querySelector("footer");

    if (!footerEl || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideOnFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.02,
      },
    );

    observer.observe(footerEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2 rounded-full border border-[rgba(20,184,166,0.35)] bg-gradient-to-r from-white to-[#f0fdfa] px-4 py-3 text-sm font-semibold text-[#0f766e] shadow-[0_14px_36px_rgba(30,64,175,0.15)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_18px_40px_rgba(20,184,166,0.2)] md:bottom-8 md:right-8 ${hideOnFooter ? "pointer-events-none opacity-0 translate-y-3" : "pointer-events-auto opacity-100 translate-y-0"}`}
    >
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#14b8a6] shadow-[0_0_0_3px_rgba(20,184,166,0.25)]" />
      WhatsApp
    </a>
  );
}
