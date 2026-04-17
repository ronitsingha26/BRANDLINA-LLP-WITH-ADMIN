import { useEffect, useState } from "react";
import heroImage from "../assets/hero.png";
import { ParallaxImage } from "../components/common/ParallaxImage";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchSettings } from "../lib/publicApi";

const defaultAboutMain = {
  aboutMainKicker: "About Us",
  aboutMainHeading:
    "BRANDLINA LLP provides comprehensive turnkey solutions for specialized infrastructure and engineering.",
  aboutMainParagraphOne:
    "We provide turnkey solutions to meet our clients' requirements for Fire Detection, PA systems, EPABX, BMS, Networking Systems, data, Voice, Video, and Security Integration.",
  aboutMainParagraphTwo:
    "Our field of specialization includes designing and implementing projects like LAN & WAN, CCTV, I.P. Surveillance, R-F Connectivity for P2P/MP2P, Wi-Fi, U.T.M Firewall, Fire Alarm System, P.A. System and Biometric & Access Control Systems, RFID System, Electrical works, HVAC, interior design, and Project Civil Work Consultancy.",
  aboutMainParagraphThree:
    "We also deliver expert Electrical engineering, Mechanical engineering, and Horticulture Maintenance and Development.",
  aboutMainImage: "",
};

const defaultAboutSections = {
  aboutMissionKicker: "Mission",
  aboutMissionTitle: "Performance under pressure.",
  aboutMissionDescription: "Build robust systems that protect people, assets and operations through reliability-first design and execution.",
  aboutVisionKicker: "Vision",
  aboutVisionTitle: "The benchmark turnkey partner.",
  aboutVisionDescription: "Become India's most trusted engineering partner for integrated safety, security and infrastructure delivery.",
  aboutTeamKicker: "Our Teams",
  aboutTeamHeading: "Specialized engineers, one coordinated execution model.",
  aboutTeams: [
    { role: "Project Engineering", count: "45+" },
    { role: "Safety & Compliance", count: "18+" },
    { role: "Field Operations", count: "60+" },
    { role: "Design & Consultancy", count: "22+" },
  ],
  aboutOfficeKicker: "Office Locations",
  aboutRegisteredOfficeTitle: "Registered Office",
  aboutRegisteredOfficeAddress: "E type 196, HEC Dhurwa Sector-2\nDhurwa, Ranchi, Jharkhand (834004)",
  aboutCorporateOfficeTitle: "Corporate Office",
  aboutCorporateOfficeAddress: "207/A Nandan enclave Tupudana\nRanchi Jharkhand (835221)",
};

export default function About() {
  const [heroMeta, setHeroMeta] = useState(null);
  const [aboutMain, setAboutMain] = useState(defaultAboutMain);
  const [aboutSections, setAboutSections] = useState(defaultAboutSections);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const settings = await fetchSettings();
        if (!mounted) {
          return;
        }

        setHeroMeta({
          kicker: settings?.aboutHeroKicker || "About",
          title: settings?.aboutHeroTitle || "Our Story, Standards and Discipline",
          route: settings?.aboutHeroRoute || "Company",
        });

        setAboutMain({
          aboutMainKicker: settings?.aboutMainKicker || defaultAboutMain.aboutMainKicker,
          aboutMainHeading: settings?.aboutMainHeading || defaultAboutMain.aboutMainHeading,
          aboutMainParagraphOne: settings?.aboutMainParagraphOne || defaultAboutMain.aboutMainParagraphOne,
          aboutMainParagraphTwo: settings?.aboutMainParagraphTwo || defaultAboutMain.aboutMainParagraphTwo,
          aboutMainParagraphThree: settings?.aboutMainParagraphThree || defaultAboutMain.aboutMainParagraphThree,
          aboutMainImage: settings?.aboutMainImage || "",
        });

        setAboutSections({
          aboutMissionKicker: settings?.aboutMissionKicker || defaultAboutSections.aboutMissionKicker,
          aboutMissionTitle: settings?.aboutMissionTitle || defaultAboutSections.aboutMissionTitle,
          aboutMissionDescription: settings?.aboutMissionDescription || defaultAboutSections.aboutMissionDescription,
          aboutVisionKicker: settings?.aboutVisionKicker || defaultAboutSections.aboutVisionKicker,
          aboutVisionTitle: settings?.aboutVisionTitle || defaultAboutSections.aboutVisionTitle,
          aboutVisionDescription: settings?.aboutVisionDescription || defaultAboutSections.aboutVisionDescription,
          aboutTeamKicker: settings?.aboutTeamKicker || defaultAboutSections.aboutTeamKicker,
          aboutTeamHeading: settings?.aboutTeamHeading || defaultAboutSections.aboutTeamHeading,
          aboutTeams:
            Array.isArray(settings?.aboutTeams) && settings.aboutTeams.length
              ? settings.aboutTeams.map((item) => ({
                  role: item?.role || "",
                  count: item?.count || "",
                }))
              : defaultAboutSections.aboutTeams,
          aboutOfficeKicker: settings?.aboutOfficeKicker || defaultAboutSections.aboutOfficeKicker,
          aboutRegisteredOfficeTitle: settings?.aboutRegisteredOfficeTitle || defaultAboutSections.aboutRegisteredOfficeTitle,
          aboutRegisteredOfficeAddress:
            settings?.aboutRegisteredOfficeAddress || defaultAboutSections.aboutRegisteredOfficeAddress,
          aboutCorporateOfficeTitle: settings?.aboutCorporateOfficeTitle || defaultAboutSections.aboutCorporateOfficeTitle,
          aboutCorporateOfficeAddress:
            settings?.aboutCorporateOfficeAddress || defaultAboutSections.aboutCorporateOfficeAddress,
        });
      } catch {
        if (mounted) {
          setHeroMeta(null);
          setAboutMain(defaultAboutMain);
          setAboutSections(defaultAboutSections);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageWrapper heroMetaOverride={heroMeta}>
      <Seo
        title="About BRANDLINA LLP"
        description="Learn about BRANDLINA LLP, our mission, engineering culture, and execution-first approach to turnkey technology projects."
      />

      <section className="page-container py-12 md:py-16">
        <Reveal>
          <p className="section-kicker">{aboutMain.aboutMainKicker}</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-6xl">
            {aboutMain.aboutMainHeading}
          </h1>
        </Reveal>

        <div className="mt-9 grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4 text-[1.04rem]">
              {aboutMain.aboutMainParagraphOne && (
                <p className="text-base leading-relaxed text-text-muted">{aboutMain.aboutMainParagraphOne}</p>
              )}
              {aboutMain.aboutMainParagraphTwo && (
                <p className="text-base leading-relaxed text-text-muted">{aboutMain.aboutMainParagraphTwo}</p>
              )}
              {aboutMain.aboutMainParagraphThree && (
                <p className="text-base leading-relaxed text-text-muted">{aboutMain.aboutMainParagraphThree}</p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ParallaxImage
              src={aboutMain.aboutMainImage || heroImage}
              alt="Brandlina team at work"
              className="h-[320px] md:h-[420px] bg-white"
              fit="contain"
              zoom={false}
              shift={0}
            />
          </Reveal>
        </div>
      </section>

      <section className="page-container py-8 md:py-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <article className="glass-card p-7 md:p-10">
              <p className="section-kicker">{aboutSections.aboutMissionKicker}</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900">{aboutSections.aboutMissionTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {aboutSections.aboutMissionDescription}
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="glass-card p-7 md:p-10">
              <p className="section-kicker">{aboutSections.aboutVisionKicker}</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900">{aboutSections.aboutVisionTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {aboutSections.aboutVisionDescription}
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="page-container py-8 md:py-14">
        <Reveal className="mb-8">
          <p className="section-kicker">{aboutSections.aboutTeamKicker}</p>
          <h2 className="max-w-4xl text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-5xl">{aboutSections.aboutTeamHeading}</h2>
        </Reveal>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {aboutSections.aboutTeams.map((member, index) => (
              <Reveal key={`${member.role}-${index}`} delay={index * 0.05}>
              <article className="glass-card p-6 text-center">
                <p className="text-3xl text-accent">{member.count}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.08em] text-text-muted">{member.role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-container pb-14 pt-8 md:pb-20">
        <Reveal className="glass-card p-7 md:p-10">
          <p className="section-kicker">{aboutSections.aboutOfficeKicker}</p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl">{aboutSections.aboutRegisteredOfficeTitle}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-muted">
                {aboutSections.aboutRegisteredOfficeAddress}
              </p>
            </div>
            <div>
              <h3 className="text-2xl">{aboutSections.aboutCorporateOfficeTitle}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-muted">
                {aboutSections.aboutCorporateOfficeAddress}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </PageWrapper>
  );
}
