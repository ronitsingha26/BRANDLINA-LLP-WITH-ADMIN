import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import services from "../../data/services.json";
import { Reveal } from "../common/Reveal";

const iconDots = ["◆", "◇", "✦", "◈", "✶", "◉"];

export function ServicesPreviewSection({ servicesData }) {
  const list = Array.isArray(servicesData) && servicesData.length > 0 ? servicesData : services;

  return (
    <section
      id="services-preview"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-[#e2e8f0]/40 py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.12),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.14),transparent_70%)]"
        aria-hidden
      />

      <div className="page-container relative text-center">
        <Reveal className="mb-14 flex flex-col items-center">
          <p className="mb-6 w-fit rounded-full border border-[rgba(34,197,94,0.3)] bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#15803d] shadow-sm backdrop-blur-sm">
            Core Capabilities
          </p>
          <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#1e293b] sm:text-4xl md:text-5xl">
            END-TO-END ENGINEERING SERVICES BUILT FOR REAL-WORLD DELIVERY
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, 6).map((service, index) => (
            <Motion.article
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_16px_48px_-20px_rgba(21,128,61,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_56px_-16px_rgba(21,128,61,0.18)] md:p-8"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(34,197,94,0.08) 0%, rgba(20,184,166,0.1) 50%, rgba(245,158,11,0.06) 100%)",
                }}
              />
              <div className="relative">
                {service.image ? (
                  <div className="mb-6 h-48 w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm relative group-hover:shadow-md transition-all">
                    <img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-green-50 text-lg text-[#15803d] shadow-md md:h-14 md:w-14 md:text-xl">
                    {iconDots[index]}
                  </div>
                )}
                <h3 className="mb-3 text-xl font-bold text-[#1e293b] sm:text-2xl">{service.title}</h3>
                <p className="font-medium leading-relaxed text-[#64748b]">{service.excerpt}</p>

                <Link
                  to={`/services/${service.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#15803d] transition-transform duration-300 group-hover:translate-x-1"
                >
                  Learn More
                  <span
                    aria-hidden="true"
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#15803d] to-[#22c55e] text-xs text-white shadow-md"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
