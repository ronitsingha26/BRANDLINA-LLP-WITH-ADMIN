import { motion as Motion } from "framer-motion";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

function resolvePageHero(pathname) {
  if (pathname === "/") {
    return {
      kicker: "Home",
      title: "Brandlina LLP // Turnkey Infrastructure",
      route: "Landing",
    };
  }

  if (pathname.startsWith("/services/")) {
    return {
      kicker: "Service Detail",
      title: "Execution Scope and Capability",
      route: "Services / Detail",
    };
  }

  if (pathname.startsWith("/projects/")) {
    return {
      kicker: "Project Detail",
      title: "Delivery Snapshot and Outcome",
      route: "Projects / Detail",
    };
  }

  if (pathname.startsWith("/blog/")) {
    return {
      kicker: "Blog Detail",
      title: "Engineering Insight and Notes",
      route: "Blog / Article",
    };
  }

  const pageLookup = {
    "/about": { kicker: "About", title: "Our Story, Standards and Discipline", route: "Company" },
    "/services": { kicker: "Services", title: "Integrated Solutions Portfolio", route: "Capabilities" },
    "/projects": { kicker: "Projects", title: "Execution Cases and Outcomes", route: "Portfolio" },
    "/industries": { kicker: "Industries", title: "Sector-Aligned Delivery Models", route: "Domain Expertise" },
    "/careers": { kicker: "Careers", title: "Build with an Execution-First Team", route: "Opportunities" },
    "/blog": { kicker: "Blog", title: "Field Learnings and Practical Insights", route: "Knowledge" },
    "/contact": { kicker: "Contact", title: "Talk to the Brandlina Team", route: "Get in Touch" },
  };

  return pageLookup[pathname] ?? {
    kicker: "Brandlina LLP",
    title: "Turnkey Infrastructure Delivery",
    route: "Overview",
  };
}

export function PageWrapper({ children, className = "", heroMetaOverride = null }) {
  const { pathname } = useLocation();
  const heroMeta = useMemo(() => heroMetaOverride || resolvePageHero(pathname), [pathname, heroMetaOverride]);

  const isHome = pathname === "/";

  return (
    <Motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full min-h-[calc(100vh-80px)] ${!isHome ? 'pt-20 md:pt-[5.5rem]' : ''} ${className}`}
    >
      {!isHome && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(37, 99, 235, 0.07), transparent 55%), radial-gradient(ellipse 80% 50% at 100% 50%, rgba(20, 184, 166, 0.06), transparent 50%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        />
      )}
      {!isHome && (
        <div className="page-container relative z-20 pb-3 pt-2 md:pb-5">
          <Motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="page-hero-bar"
          >
            <div>
              <p className="page-hero-kicker">{heroMeta.kicker}</p>
              <p className="page-hero-title">{heroMeta.title}</p>
            </div>
            <p className="page-hero-route">{heroMeta.route}</p>
          </Motion.div>
        </div>
      )}
      {children}
    </Motion.section>
  );
}
