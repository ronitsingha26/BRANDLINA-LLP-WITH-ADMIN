import { useState } from "react";
import { Link } from "react-router-dom";


const fallbackClients = [
  { name: "MCL", abbr: "MCL", color: "#1A3A5C", bg: "#E8EEF5", logo: "/client-logos/mcl.png" },
  { name: "MECO Technologies", abbr: "MECO", color: "#2E7D32", bg: "#E8F5E9", logo: "/client-logos/meco.png" },
  { name: "MECON", abbr: "MCN", color: "#0D47A1", bg: "#E3F2FD", logo: "/client-logos/mecon.png" },
  { name: "GAIL", abbr: "GAIL", color: "#B71C1C", bg: "#FFF9C4", logo: "/client-logos/gail.png" },
  { name: "SAIL", abbr: "SAIL", color: "#C0392B", bg: "#FDECEA", logo: "/client-logos/sail.png" },
  { name: "ONGC", abbr: "ONGC", color: "#E65100", bg: "#FFF3E0", logo: "/client-logos/ongc.png" },
  { name: "Tata Steel", abbr: "TS", color: "#1A3A5C", bg: "#E8EEF5", logo: "/client-logos/tata-steel.png" },
  { name: "CCL", abbr: "CCL", color: "#37474F", bg: "#ECEFF1", logo: "/client-logos/ccl.png" },
  { name: "BHEL", abbr: "BHEL", color: "#6A1B9A", bg: "#F3E5F5", logo: "/client-logos/bhel.png" },
  { name: "NTPC", abbr: "NTPC", color: "#1565C0", bg: "#E3F2FD", logo: "/client-logos/ntpc.png" },
];

const fallbackLogoByName = fallbackClients.reduce((acc, item) => {
  acc[item.name.toLowerCase()] = item.logo;
  return acc;
}, {});

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "CL";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function parseClient(item) {
  if (item && typeof item === "object") {
    const name = String(item.name || "").trim();
    const logo = String(item.logo || "").trim();

    if (!name) {
      return null;
    }

    return {
      name,
      logo: logo || fallbackLogoByName[name.toLowerCase()] || "",
    };
  }

  const raw = String(item || "").trim();

  if (!raw) {
    return null;
  }

  const [namePart, ...logoPart] = raw.split("|");
  const name = namePart.trim();
  const logo = logoPart.join("|").trim();

  if (!name) {
    return null;
  }

  return {
    name,
    logo: logo || fallbackLogoByName[name.toLowerCase()] || "",
  };
}

function LogoCard({ client }) {
  const { name, logo, abbr, color, bg } = client;
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = logo && !imgFailed;

  return (
    <div
      className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white bg-white shadow-[0_8px_32px_-12px_rgba(202,138,4,0.25)] ring-1 ring-yellow-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(202,138,4,0.35)] hover:scale-[1.03]"
      style={{ width: "160px", height: "140px", padding: "18px 14px 14px" }}
      title={name}
      aria-label={name}
    >
      {/* Logo area */}
      <div
        className="flex items-center justify-center rounded-xl w-full"
        style={{ height: "72px", backgroundColor: showImg ? "transparent" : (bg || "#E8F5E9") }}
      >
        {showImg ? (
          <img
            src={logo}
            alt={`${name} logo`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="max-h-full w-auto max-w-full object-contain"
            style={{ maxHeight: "64px", maxWidth: "120px" }}
          />
        ) : (
          <span
            className="text-2xl font-extrabold tracking-wider"
            style={{ color: color || "#1B5E20" }}
          >
            {abbr || getInitials(name)}
          </span>
        )}
      </div>

      {/* Company name */}
      <p className="text-center text-[13px] font-bold leading-tight text-slate-700 w-full line-clamp-2">
        {name}
      </p>
    </div>
  );
}


export function MarqueeStrip({ items }) {
  // Always use fallbackClients (real company logos).
  // CMS marquee items are service keywords (Fire Alarm, CCTV, etc.) — not client entries.
  const clients = fallbackClients;
  const rowOne = clients.concat(clients);
  const rowTwoBase = clients.slice().reverse();
  const rowTwo = rowTwoBase.concat(rowTwoBase);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f7fbff] to-[#eefaf5] py-16 md:py-24">
      <div className="page-container">
        <article className="clients-marquee relative overflow-hidden rounded-2xl border border-yellow-300/60 bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-300 p-8 shadow-[0_34px_90px_-36px_rgba(202,138,4,0.25)] md:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex w-fit rounded-full border border-white/60 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 shadow-sm">
                OUR CLIENTS
              </p>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-transparent bg-gradient-to-br from-emerald-800 via-emerald-600 to-white bg-clip-text drop-shadow-sm sm:text-4xl md:text-5xl">
                Trusted by Our Valuable Clients
              </h2>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-emerald-900/80 md:text-base">
                We partner with ambitious teams across infrastructure, manufacturing, and enterprise
                operations to deliver secure, scalable, and reliable technology outcomes.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex h-fit items-center gap-2 rounded-full border border-emerald-500 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
            >
              View Projects
              <span aria-hidden>-&gt;</span>
            </Link>
          </div>

          <div className="relative mt-8 space-y-4 md:mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-white/40 p-3 md:p-4">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-yellow-100 via-yellow-100/80 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-yellow-100 via-yellow-100/80 to-transparent"
                aria-hidden
              />

              <div className="clients-track-left flex w-max items-center gap-3 md:gap-4">
                {rowOne.map((client, index) => (
                  <LogoCard key={`row-1-${client.name}-${index}`} client={client} />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-white/40 p-3 md:p-4">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-yellow-100 via-yellow-100/80 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-yellow-100 via-yellow-100/80 to-transparent"
                aria-hidden
              />

              <div className="clients-track-right flex w-max items-center gap-3 md:gap-4">
                {rowTwo.map((client, index) => (
                  <LogoCard key={`row-2-${client.name}-${index}`} client={client} />
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
