import { useEffect, useState } from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Seo } from "../components/common/Seo";
import { HeroSection } from "../components/home/HeroSection";
import { ServicesPreviewSection } from "../components/home/ServicesPreviewSection";
import { StatsSection } from "../components/home/StatsSection";
import { MarqueeStrip } from "../components/home/MarqueeStrip";
import { AboutPreviewSection } from "../components/home/AboutPreviewSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { CtaBannerSection } from "../components/home/CtaBannerSection";
import { fetchHomepage, fetchServices } from "../lib/publicApi";

export default function Home() {
  const [homepage, setHomepage] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [homepageData, servicesData] = await Promise.all([fetchHomepage(), fetchServices()]);
        if (!mounted) {
          return;
        }

        setHomepage(homepageData);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch {
        // Keep existing local fallbacks when API is unavailable.
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageWrapper className="pt-0">
      <Seo
        title="BRANDLINA LLP | Trusted Technology Partner"
        description="BRANDLINA LLP delivers turnkey technology solutions across fire systems, CCTV, networking, HVAC and security infrastructure."
      />
      <HeroSection hero={homepage?.hero} />
      <ServicesPreviewSection servicesData={services} />
      <StatsSection statsData={homepage?.stats} />
      <AboutPreviewSection about={homepage?.about} />
      <MarqueeStrip items={homepage?.marquee} />
      <TestimonialsSection />
      <CtaBannerSection bannerImage={homepage?.cta?.bannerImage} />
    </PageWrapper>
  );
}
