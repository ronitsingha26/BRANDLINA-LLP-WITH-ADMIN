import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import { ParallaxImage } from "../common/ParallaxImage";
import { Reveal } from "../common/Reveal";

const fallbackAbout = {
  kicker: "About Brandlina",
  heading: "Engineering-first teams delivering resilient systems for tomorrow.",
  description:
    "BRANDLINA LLP provides comprehensive turnkey solutions for Fire Detection, PA Systems, EPABX, BMS, Networking, Security Integration, Electrical & Mechanical Works, Civil Consultancy, and more. We deliver end-to-end technology and infrastructure that performs under real-world load.",
  ctaLabel: "Discover our story",
};

export function AboutPreviewSection({ about, previewImage }) {
  const content = {
    ...fallbackAbout,
    ...(about || {}),
  };
  const imageSource = content.previewImage || previewImage || heroImage;

  return (
    <section className="py-16 md:py-24">
      <div className="page-container grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="section-kicker">{content.kicker}</p>
          <h2 className="section-heading max-w-2xl">{content.heading}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted">
            {content.description}
          </p>
          <Link to="/about" className="btn-secondary mt-8 inline-flex">
            {content.ctaLabel}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <ParallaxImage src={imageSource} alt="Brandlina execution" className="h-[360px] md:h-[460px]" shift={55} />
        </Reveal>
      </div>
    </section>
  );
}
