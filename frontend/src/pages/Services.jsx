import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import services from "../data/services.json";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchServices } from "../lib/publicApi";

export default function Services() {
  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchServices();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setServiceItems(data);
        } else if (mounted) {
          setServiceItems(services);
        }
      } catch {
        if (mounted) {
          setServiceItems(services);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageWrapper>
      <Seo
        title="Services | BRANDLINA LLP"
        description="Explore BRANDLINA LLP services: fire systems, CCTV, networking, access control, electrical/HVAC and consultancy."
      />

      <section className="page-container py-12 md:py-16">
        <Reveal>
          <p className="section-kicker">Services</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-6xl">
            Complete turnkey technology solutions.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted md:text-lg">
            From strategy and design to deployment and support, we deliver integrated
            solutions that are reliable, scalable and audit-ready.
          </p>
        </Reveal>

        {loading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[1.125rem] border border-slate-200/80 bg-white/90 p-7 shadow-sm backdrop-blur-sm md:p-8"
              >
                <div className="shimmer-skeleton mb-4 h-3 w-24 rounded-full" />
                <div className="shimmer-skeleton mb-3 h-8 w-[85%] rounded-lg" />
                <div className="shimmer-skeleton mb-2 h-3 w-full rounded-md" />
                <div className="shimmer-skeleton mb-2 h-3 w-full rounded-md" />
                <div className="shimmer-skeleton mt-6 h-10 w-32 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.04}>
              <article className="glass-card h-full p-7 md:p-8 hover:-translate-y-1 transition-transform duration-300">
                {service.image && (
                   <div className="mb-5 h-48 w-full overflow-hidden rounded-xl border border-slate-100/50 shadow-sm">
                      <img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                   </div>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{service.category}</p>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900">{service.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{service.excerpt}</p>

                <ul className="mt-6 space-y-2 text-sm text-text-muted">
                  {(service.features || []).slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={`/services/${service.id}`} className="btn-secondary mt-7 inline-flex">
                  View Details
                </Link>
              </article>
            </Reveal>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
