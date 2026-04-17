import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchProjectById } from "../lib/publicApi";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchProjectById(id);
        if (mounted) {
          setProject(data);
        }
      } catch {
        if (mounted) {
          setProject(null);
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
  }, [id]);

  if (loading && !project) {
    return (
      <PageWrapper>
        <section className="page-container py-12 md:py-16">
          <p className="text-sm text-text-muted">Loading project details...</p>
        </section>
      </PageWrapper>
    );
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <PageWrapper>
      <Seo
        title={`${project.title} | BRANDLINA LLP`}
        description={project.description}
      />

      <section className="page-container py-12 md:py-16">
        <Reveal>
          <p className="section-kicker">{project.category}</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted md:text-lg">
            {project.description}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(project.gallery || project.images || []).map((image, index) => (
            <Reveal key={`${project.id}-${index}`} delay={index * 0.05}>
              <img
                src={image}
                alt={`${project.title} gallery ${index + 1}`}
                loading="lazy"
                className="h-56 w-full rounded-2xl border border-black/10 object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="glass-card mt-10 p-7 md:p-9">
          <p className="section-kicker">Outcome</p>
          <p className="mt-3 text-3xl font-bold leading-tight text-slate-900">{project.outcome}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              Discuss Similar Project
            </Link>
            <Link to="/projects" className="btn-secondary">
              Back to Projects
            </Link>
          </div>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
