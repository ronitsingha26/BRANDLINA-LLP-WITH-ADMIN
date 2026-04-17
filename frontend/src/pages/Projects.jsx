import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchProjects } from "../lib/publicApi";

function ProjectCardSkeleton({ tall }) {
  return (
    <div
      className={`break-inside-avoid mb-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ${
        tall ? "md:mb-8" : ""
      }`}
    >
      <div className={`shimmer-skeleton w-full ${tall ? "h-72" : "h-52"}`} />
      <div className="space-y-3 p-6">
        <div className="shimmer-skeleton mx-auto h-3 w-24 rounded-full" />
        <div className="shimmer-skeleton h-6 w-[80%] rounded-lg" />
        <div className="shimmer-skeleton h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Projects() {
  const [projectItems, setProjectItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchProjects();
        if (mounted && Array.isArray(data)) {
          setProjectItems(data);
        }
      } catch {
        if (mounted) {
          setProjectItems([]);
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

  const categories = useMemo(() => {
    const fromProjects = projectItems.map((project) => project.category).filter(Boolean);
    return ["All", ...new Set(fromProjects)];
  }, [projectItems]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projectItems;
    }
    return projectItems.filter((project) => project.category === activeCategory);
  }, [activeCategory, projectItems]);

  useEffect(() => {
    if (!preview) return;
    function onKey(e) {
      if (e.key === "Escape") setPreview(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  return (
    <PageWrapper>
      <Seo
        title="Projects | BRANDLINA LLP"
        description="Explore BRANDLINA LLP execution portfolio across CCTV, networking, fire systems and infrastructure projects."
      />

      <section className="page-container py-12 md:py-16">
        <Reveal>
          <p className="section-kicker">Projects</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-tight text-[#1e293b] sm:text-4xl md:text-6xl">
            Execution stories from real-world deployments.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted md:text-lg">
            A selection of delivered assignments across infrastructure modernization, fire systems,
            networking backbones, and integrated monitoring environments.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                activeCategory === category
                  ? "border-[rgba(37,99,235,0.45)] bg-gradient-to-r from-[rgba(37,99,235,0.14)] to-[rgba(20,184,166,0.1)] text-[#1e293b] shadow-sm"
                  : "border-slate-200 bg-white text-[#64748b] hover:border-[rgba(37,99,235,0.25)] hover:text-[#1e293b]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-10 columns-1 gap-6 space-y-0 md:columns-2 xl:columns-3">
            <ProjectCardSkeleton tall />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton tall />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton tall />
          </div>
        ) : filteredProjects.length === 0 ? (
          <p className="mt-10 text-sm text-text-muted">No projects available yet. Add projects from the admin panel.</p>
        ) : (
          <div className="mt-10 columns-1 gap-6 space-y-0 md:columns-2 xl:columns-3">
            {filteredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.04}>
                <article className="group break-inside-avoid mb-6 overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_16px_48px_-24px_rgba(30,64,175,0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-20px_rgba(30,64,175,0.2)]">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.cover}
                      alt={project.title}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                        index % 3 === 0 ? "h-64" : "h-52"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/75 via-[#1e293b]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <button
                      type="button"
                      onClick={() => setPreview(project)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <span className="rounded-full border border-white/40 bg-white/95 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1e40af] shadow-lg backdrop-blur-md">
                        Preview
                      </span>
                    </button>
                    <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1e40af] shadow-sm backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">{project.category}</p>
                    <h2 className="mt-3 text-2xl font-bold leading-tight text-[#1e293b]">{project.title}</h2>
                    <p className="mt-2 text-sm text-text-muted">{project.location}</p>
                    <p className="mt-4 text-sm leading-relaxed text-text-muted">{project.description}</p>
                    <Link to={`/projects/${project.id}`} className="btn-secondary mt-6 inline-flex">
                      View Case Study
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {preview && (
          <Motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[#0f172a]/55 backdrop-blur-md"
              aria-label="Close preview"
              onClick={() => setPreview(null)}
            />
            <Motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-preview-title"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 max-h-[min(90vh,840px)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/70 bg-white shadow-[0_32px_80px_-20px_rgba(30,64,175,0.35)]"
            >
              <div className="relative h-56 w-full overflow-hidden sm:h-72">
                <img src={preview.cover} alt={preview.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/50 to-transparent" />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-lg text-[#1e293b] shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="p-6 sm:p-8">
                <span className="inline-flex rounded-full border border-[rgba(37,99,235,0.2)] bg-[rgba(37,99,235,0.06)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                  {preview.category}
                </span>
                <h2 id="project-preview-title" className="mt-4 text-2xl font-bold text-[#1e293b] sm:text-3xl">
                  {preview.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted">{preview.location}</p>
                <p className="mt-5 text-sm leading-relaxed text-text-muted">{preview.description}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to={`/projects/${preview.id}`}
                    className="btn-primary inline-flex flex-1 justify-center sm:flex-none"
                    onClick={() => setPreview(null)}
                  >
                    View Case Study
                  </Link>
                  <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => setPreview(null)}>
                    Close
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
