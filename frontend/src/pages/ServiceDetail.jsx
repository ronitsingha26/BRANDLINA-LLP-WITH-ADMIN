import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import services from "../data/services.json";
import { ParallaxImage } from "../components/common/ParallaxImage";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchServiceById } from "../lib/publicApi";

export default function ServiceDetail() {
  const { id } = useParams();
  const fallbackService = services.find((item) => item.id === id);
  const [service, setService] = useState(fallbackService || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchServiceById(id);
        if (mounted) {
          setService(data);
        }
      } catch {
        if (mounted) {
          setService(fallbackService || null);
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
  }, [id, fallbackService]);

  if (loading && !service) {
    return (
      <PageWrapper>
        <section className="page-container py-12 md:py-16">
          <p className="text-sm text-text-muted">Loading service details...</p>
        </section>
      </PageWrapper>
    );
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <PageWrapper>
      <Seo
        title={`${service.title} | BRANDLINA LLP`}
        description={service.excerpt}
      />

      <section className="page-container py-12 md:py-16">
        <Reveal>
          <p className="section-kicker">{service.category}</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-6xl">{service.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted md:text-lg">
            {service.description}
          </p>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ParallaxImage src={service.image} alt={service.title} className="h-[280px] sm:h-[340px] md:h-[470px]" shift={45} />
          </Reveal>

          <Reveal delay={0.08} className="glass-card p-7 md:p-9">
            <h2 className="text-2xl font-bold text-slate-900">What We Deliver</h2>
            <ul className="mt-6 space-y-3 text-sm text-text-muted">
              {(service.features || []).map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                Start Project
              </Link>
              <Link to="/services" className="btn-secondary">
                Back to Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
}
