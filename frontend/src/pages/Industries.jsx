import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";

const industries = [
  {
    title: "Commercial",
    description: "Scalable surveillance, access and infrastructure systems for offices, malls and mixed-use spaces.",
  },
  {
    title: "Industrial",
    description: "High-reliability network and safety frameworks designed for mission-critical production environments.",
  },
  {
    title: "Government",
    description: "Compliance-first deployments for administrative campuses and public infrastructure programs.",
  },
  {
    title: "Residential",
    description: "Integrated security and automation systems tailored for gated communities and high-rise residences.",
  },
];

export default function Industries() {
  return (
    <PageWrapper>
      <Seo
        title="Industries | BRANDLINA LLP"
        description="BRANDLINA LLP delivers turnkey technology solutions across commercial, industrial, government and residential sectors."
      />

      <section className="page-container py-14 md:py-20">
        <Reveal>
          <p className="section-kicker">Industries</p>
          <h1 className="section-heading">Domain-aware execution for high-stakes environments.</h1>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {industries.map((industry, index) => (
            <Reveal key={industry.title} delay={index * 0.05}>
              <article className="glass-card h-full p-7 md:p-9">
                <h2 className="text-3xl">{industry.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">{industry.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
