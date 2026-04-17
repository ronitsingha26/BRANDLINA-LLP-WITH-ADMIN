import { useState } from "react";

const logoByVariant = {
  navbar: "h-22 max-w-[300px] px-0 py-0 border-0 bg-transparent shadow-none rounded-none",
  footer: "h-20 max-w-[360px] px-0 py-0 border-0 bg-transparent shadow-none rounded-none",
  auth: "h-[86px] max-w-[320px] px-0 py-0 border-0 bg-transparent shadow-none rounded-none",
  sidebar: "h-24 max-w-[230px] px-0 py-0 border-0 bg-transparent shadow-none rounded-none",
};

export function BrandLogo({ variant = "navbar", className = "" }) {
  const [hasError, setHasError] = useState(false);
  const sizeClass = logoByVariant[variant] ?? logoByVariant.navbar;

  return (
    <span className={`brand-logo-shell ${sizeClass} ${className}`}>
      {hasError ? (
        <span className="brand-logo-fallback">BRANDLINA LLP</span>
      ) : (
        <img
          src="/brandlina-logo.png"
          alt="BRANDLINA LLP logo"
          className="brand-logo-image"
          loading="eager"
          decoding="async"
          onError={() => setHasError(true)}
        />
      )}
    </span>
  );
}
