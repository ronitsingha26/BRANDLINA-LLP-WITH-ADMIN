import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminApiClient as apiClient } from "../../lib/apiClient";

function emptyTestimonial() {
  return { quote: "", author: "", role: "", initials: "", image: "", imagePublicId: "" };
}

function emptyStat() {
  return { label: "", value: 0, suffix: "" };
}

export default function HomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [ctaImageFile, setCtaImageFile] = useState(null);
  // Per-testimonial portrait images
  const [testimonialImageFiles, setTestimonialImageFiles] = useState([]);
  const [testimonialImagePreviews, setTestimonialImagePreviews] = useState([]);
  const [imagePreview, setImagePreview] = useState({
    hero: "",
    about: "",
    cta: "",
  });
  const [hero, setHero] = useState({
    brandline: "",
    titleLineOne: "",
    titleLineTwo: "",
    titleAccent: "",
    subtitle: "",
    ctaPrimary: "",
  });
  const [about, setAbout] = useState({
    kicker: "",
    heading: "",
    description: "",
    ctaLabel: "",
  });
  const [aboutPageHero, setAboutPageHero] = useState({
    aboutHeroKicker: "About",
    aboutHeroTitle: "Our Story, Standards and Discipline",
    aboutHeroRoute: "Company",
  });
  const [aboutPageContent, setAboutPageContent] = useState({
    aboutMainKicker: "About Us",
    aboutMainHeading: "BRANDLINA LLP provides comprehensive turnkey solutions for specialized infrastructure and engineering.",
    aboutMainParagraphOne:
      "We provide turnkey solutions to meet our clients' requirements for Fire Detection, PA systems, EPABX, BMS, Networking Systems, data, Voice, Video, and Security Integration.",
    aboutMainParagraphTwo:
      "Our field of specialization includes designing and implementing projects like LAN & WAN, CCTV, I.P. Surveillance, R-F Connectivity for P2P/MP2P, Wi-Fi, U.T.M Firewall, Fire Alarm System, P.A. System and Biometric & Access Control Systems, RFID System, Electrical works, HVAC, interior design, and Project Civil Work Consultancy.",
    aboutMainParagraphThree:
      "We also deliver expert Electrical engineering, Mechanical engineering, and Horticulture Maintenance and Development.",
    aboutMainImage: "",
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
  });
  const [aboutPageImageFile, setAboutPageImageFile] = useState(null);
  const [aboutPageImagePreview, setAboutPageImagePreview] = useState("");
  const [stats, setStats] = useState([emptyStat(), emptyStat(), emptyStat(), emptyStat()]);
  const [testimonials, setTestimonials] = useState([
    {
      quote: "Brandlina executed our CCTV and access control integration across all MCL mine sites with exceptional safety compliance. Their documentation and handover quality set a new benchmark for us.",
      author: "Rajendra Kumar Singh",
      role: "Chief Engineer, Mahanadi Coalfields Limited (MCL)",
      initials: "RKS",
    },
    {
      quote: "MECO Technologies partnered with Brandlina for our network and PA system rollout. Their methodical approach and zero-disruption delivery impressed our entire operations team.",
      author: "Anand Prasad",
      role: "Head of IT Infrastructure, MECO Technologies Pvt. Ltd.",
      initials: "AP",
    },
    {
      quote: "The IP surveillance and pipeline security integration Brandlina delivered for GAIL across our Jharkhand zone was flawless. Full compliance with OISD standards and delivered ahead of schedule.",
      author: "Sunita Mahato",
      role: "Project Director, GAIL (India) Limited",
      initials: "SM",
    },
    {
      quote: "Brandlina handled our fire alarm zoning, EPABX, and BMS integration across the Bokaro Steel City township. The coordination between their teams was impeccable throughout.",
      author: "Vikram Banerjee",
      role: "Plant Administrator, Steel Authority of India (SAIL)",
      initials: "VB",
    },
    {
      quote: "Our LAN/WAN and IP telephony upgrade at NTPC Patratu was mission-critical. Brandlina delivered a zero-downtime cutover with full documentation and post-handover support.",
      author: "P. N. Sharma",
      role: "CTO, NTPC Limited, Patratu Thermal Power Station",
      initials: "PNS",
    },
    {
      quote: "Brandlina's HVAC and MEP coordination across our ONGC field office in Ranchi was seamless. Their team understood industrial-grade uptime requirements and delivered accordingly.",
      author: "Deepa Mishra",
      role: "Facilities Manager, ONGC, Jharkhand Field Zone",
      initials: "DM",
    },
    {
      quote: "For Tata Steel's expanding service infrastructure in Jamshedpur, Brandlina provided a scalable and well-documented biometric access and RFID solution. Highly recommended.",
      author: "Avinash Kumar Tiwari",
      role: "Infrastructure Lead, Tata Steel Limited",
      initials: "AKT",
    },
    {
      quote: "MECON's new corporate headquarters in Ranchi required a complete building management upgrade. Brandlina delivered the entire MEP, security, and networking scope within the agreed timeline.",
      author: "Ravi Choudhary",
      role: "Programme Manager, MECON Limited, Ranchi",
      initials: "RC",
    },
  ]);
  const [marqueeText, setMarqueeText] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await apiClient.get("/homepage");

        if (!mounted) {
          return;
        }

        setHero({
          brandline: data.hero?.brandline || "",
          titleLineOne: data.hero?.titleLineOne || "",
          titleLineTwo: data.hero?.titleLineTwo || "",
          titleAccent: data.hero?.titleAccent || "",
          subtitle: data.hero?.subtitle || "",
          ctaPrimary: data.hero?.ctaPrimary || "Explore Services",
        });

        setAbout({
          kicker: data.about?.kicker || "About Brandlina",
          heading: data.about?.heading || "",
          description: data.about?.description || "",
          ctaLabel: data.about?.ctaLabel || "Discover our story",
        });

        setStats(data.stats?.length ? data.stats : [emptyStat()]);
        setTestimonials(data.testimonials?.length ? data.testimonials : [emptyTestimonial()]);
        setMarqueeText((data.marquee || []).join(", "));
        setImagePreview({
          hero: data.hero?.backgroundImage || "",
          about: data.about?.previewImage || "",
          cta: data.cta?.bannerImage || "",
        });

        try {
          const { data: settings } = await apiClient.get("/settings");
          if (mounted) {
            setAboutPageHero({
              aboutHeroKicker: settings?.aboutHeroKicker || "About",
              aboutHeroTitle: settings?.aboutHeroTitle || "Our Story, Standards and Discipline",
              aboutHeroRoute: settings?.aboutHeroRoute || "Company",
            });
            setAboutPageContent({
              aboutMainKicker: settings?.aboutMainKicker || "About Us",
              aboutMainHeading:
                settings?.aboutMainHeading ||
                "BRANDLINA LLP provides comprehensive turnkey solutions for specialized infrastructure and engineering.",
              aboutMainParagraphOne:
                settings?.aboutMainParagraphOne ||
                "We provide turnkey solutions to meet our clients' requirements for Fire Detection, PA systems, EPABX, BMS, Networking Systems, data, Voice, Video, and Security Integration.",
              aboutMainParagraphTwo:
                settings?.aboutMainParagraphTwo ||
                "Our field of specialization includes designing and implementing projects like LAN & WAN, CCTV, I.P. Surveillance, R-F Connectivity for P2P/MP2P, Wi-Fi, U.T.M Firewall, Fire Alarm System, P.A. System and Biometric & Access Control Systems, RFID System, Electrical works, HVAC, interior design, and Project Civil Work Consultancy.",
              aboutMainParagraphThree:
                settings?.aboutMainParagraphThree ||
                "We also deliver expert Electrical engineering, Mechanical engineering, and Horticulture Maintenance and Development.",
              aboutMainImage: settings?.aboutMainImage || "",
              aboutMissionKicker: settings?.aboutMissionKicker || "Mission",
              aboutMissionTitle: settings?.aboutMissionTitle || "Performance under pressure.",
              aboutMissionDescription:
                settings?.aboutMissionDescription ||
                "Build robust systems that protect people, assets and operations through reliability-first design and execution.",
              aboutVisionKicker: settings?.aboutVisionKicker || "Vision",
              aboutVisionTitle: settings?.aboutVisionTitle || "The benchmark turnkey partner.",
              aboutVisionDescription:
                settings?.aboutVisionDescription ||
                "Become India's most trusted engineering partner for integrated safety, security and infrastructure delivery.",
              aboutTeamKicker: settings?.aboutTeamKicker || "Our Teams",
              aboutTeamHeading: settings?.aboutTeamHeading || "Specialized engineers, one coordinated execution model.",
              aboutTeams:
                Array.isArray(settings?.aboutTeams) && settings.aboutTeams.length
                  ? settings.aboutTeams.map((item) => ({
                      role: item?.role || "",
                      count: item?.count || "",
                    }))
                  : [
                      { role: "Project Engineering", count: "45+" },
                      { role: "Safety & Compliance", count: "18+" },
                      { role: "Field Operations", count: "60+" },
                      { role: "Design & Consultancy", count: "22+" },
                    ],
              aboutOfficeKicker: settings?.aboutOfficeKicker || "Office Locations",
              aboutRegisteredOfficeTitle: settings?.aboutRegisteredOfficeTitle || "Registered Office",
              aboutRegisteredOfficeAddress:
                settings?.aboutRegisteredOfficeAddress || "E type 196, HEC Dhurwa Sector-2\nDhurwa, Ranchi, Jharkhand (834004)",
              aboutCorporateOfficeTitle: settings?.aboutCorporateOfficeTitle || "Corporate Office",
              aboutCorporateOfficeAddress:
                settings?.aboutCorporateOfficeAddress || "207/A Nandan enclave Tupudana\nRanchi Jharkhand (835221)",
            });
            setAboutPageImagePreview(settings?.aboutMainImage || "");
          }
        } catch {
          if (mounted) {
            setAboutPageHero({
              aboutHeroKicker: "About",
              aboutHeroTitle: "Our Story, Standards and Discipline",
              aboutHeroRoute: "Company",
            });
            setAboutPageContent({
              aboutMainKicker: "About Us",
              aboutMainHeading: "BRANDLINA LLP provides comprehensive turnkey solutions for specialized infrastructure and engineering.",
              aboutMainParagraphOne:
                "We provide turnkey solutions to meet our clients' requirements for Fire Detection, PA systems, EPABX, BMS, Networking Systems, data, Voice, Video, and Security Integration.",
              aboutMainParagraphTwo:
                "Our field of specialization includes designing and implementing projects like LAN & WAN, CCTV, I.P. Surveillance, R-F Connectivity for P2P/MP2P, Wi-Fi, U.T.M Firewall, Fire Alarm System, P.A. System and Biometric & Access Control Systems, RFID System, Electrical works, HVAC, interior design, and Project Civil Work Consultancy.",
              aboutMainParagraphThree:
                "We also deliver expert Electrical engineering, Mechanical engineering, and Horticulture Maintenance and Development.",
              aboutMainImage: "",
              aboutMissionKicker: "Mission",
              aboutMissionTitle: "Performance under pressure.",
              aboutMissionDescription:
                "Build robust systems that protect people, assets and operations through reliability-first design and execution.",
              aboutVisionKicker: "Vision",
              aboutVisionTitle: "The benchmark turnkey partner.",
              aboutVisionDescription:
                "Become India's most trusted engineering partner for integrated safety, security and infrastructure delivery.",
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
            });
            setAboutPageImagePreview("");
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load homepage content");
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

  const canSave = useMemo(() => Boolean(hero.titleLineOne && hero.subtitle), [hero]);

  function updateHero(field, value) {
    setHero((prev) => ({ ...prev, [field]: value }));
  }

  function updateAbout(field, value) {
    setAbout((prev) => ({ ...prev, [field]: value }));
  }

  function updateAboutPageHero(field, value) {
    setAboutPageHero((prev) => ({ ...prev, [field]: value }));
  }

  function updateAboutPageContent(field, value) {
    setAboutPageContent((prev) => ({ ...prev, [field]: value }));
  }

  function updateAboutTeam(index, field, value) {
    setAboutPageContent((prev) => {
      const nextTeams = [...prev.aboutTeams];
      nextTeams[index] = {
        ...nextTeams[index],
        [field]: value,
      };

      return {
        ...prev,
        aboutTeams: nextTeams,
      };
    });
  }

  function addAboutTeam() {
    setAboutPageContent((prev) => ({
      ...prev,
      aboutTeams: [...prev.aboutTeams, { role: "", count: "" }],
    }));
  }

  function removeAboutTeam(index) {
    setAboutPageContent((prev) => ({
      ...prev,
      aboutTeams: prev.aboutTeams.filter((_, i) => i !== index),
    }));
  }

  function updateStat(index, field, value) {
    setStats((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "value" ? Number(value || 0) : value,
      };
      return next;
    });
  }

  function addStat() {
    setStats((prev) => [...prev, emptyStat()]);
  }

  function removeStat(index) {
    setStats((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTestimonial(index, field, value) {
    setTestimonials((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addTestimonial() {
    setTestimonials((prev) => [...prev, emptyTestimonial()]);
  }

  function handleImageChange(type, event) {
    const file = event.target.files?.[0] || null;

    if (type === "hero") {
      setHeroImageFile(file);
    }

    if (type === "about") {
      setAboutImageFile(file);
    }

    if (type === "cta") {
      setCtaImageFile(file);
    }

    if (file) {
      setImagePreview((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
    }
  }

  function handleAboutPageImageChange(event) {
    const file = event.target.files?.[0] || null;
    setAboutPageImageFile(file);

    if (file) {
      setAboutPageImagePreview(URL.createObjectURL(file));
    }
  }

  function handleTestimonialImageChange(index, event) {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    setTestimonialImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });

    setTestimonialImagePreviews((prev) => {
      const next = [...prev];
      next[index] = URL.createObjectURL(file);
      return next;
    });
  }

  function removeTestimonial(index) {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
    setTestimonialImageFiles((prev) => prev.filter((_, i) => i !== index));
    setTestimonialImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!canSave) {
      toast.error("Hero title and subtitle are required");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("hero", JSON.stringify(hero));
      payload.append("about", JSON.stringify(about));
      payload.append("stats", JSON.stringify(stats));
      payload.append(
        "marquee",
        JSON.stringify(
          marqueeText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      if (heroImageFile) payload.append("heroImage", heroImageFile);
      if (aboutImageFile) payload.append("aboutImage", aboutImageFile);
      if (ctaImageFile) payload.append("ctaImage", ctaImageFile);

      await apiClient.put("/homepage", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const settingsPayload = new FormData();
      const settingsToSave = {
        ...aboutPageHero,
        ...aboutPageContent,
      };

      Object.entries(settingsToSave).forEach(([key, value]) => {
        if (key === "aboutTeams") {
          settingsPayload.append(key, JSON.stringify(Array.isArray(value) ? value : []));
          return;
        }

        settingsPayload.append(key, value ?? "");
      });

      if (aboutPageImageFile) {
        settingsPayload.append("aboutMainImage", aboutPageImageFile);
      }

      const { data: updatedSettings } = await apiClient.put("/settings", settingsPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setHeroImageFile(null);
      setAboutImageFile(null);
      setCtaImageFile(null);
      setAboutPageImageFile(null);
      setAboutPageImagePreview(updatedSettings?.aboutMainImage || aboutPageImagePreview);
      setAboutPageContent((prev) => ({
        ...prev,
        aboutMainImage: updatedSettings?.aboutMainImage || prev.aboutMainImage,
      }));
      toast.success("Homepage content updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Homepage</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Homepage Management</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Hero Section</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading hero...</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["brandline", "Brandline"],
                ["titleLineOne", "Title Line One"],
                ["titleLineTwo", "Title Line Two"],
                ["titleAccent", "Title Accent"],
                ["ctaPrimary", "Primary CTA Label"],
              ].map(([field, label]) => (
                <label key={field} className="block text-sm font-medium text-slate-700">
                  {label}
                  <input
                    value={hero[field] || ""}
                    onChange={(e) => updateHero(field, e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>
              ))}
              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Subtitle
                <textarea
                  rows={3}
                  value={hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">About Section</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading about content...</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Kicker
                <input
                  value={about.kicker}
                  onChange={(e) => updateAbout("kicker", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                CTA Label
                <input
                  value={about.ctaLabel}
                  onChange={(e) => updateAbout("ctaLabel", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Heading
                <textarea
                  rows={2}
                  value={about.heading}
                  onChange={(e) => updateAbout("heading", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Description
                <textarea
                  rows={4}
                  value={about.description}
                  onChange={(e) => updateAbout("description", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">About Page Hero Bar</h2>
          <p className="mt-1 text-sm text-slate-500">
            Controls the top hero strip on the About page (/about).
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Kicker
              <input
                value={aboutPageHero.aboutHeroKicker}
                onChange={(e) => updateAboutPageHero("aboutHeroKicker", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Route Label
              <input
                value={aboutPageHero.aboutHeroRoute}
                onChange={(e) => updateAboutPageHero("aboutHeroRoute", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="md:col-span-2 block text-sm font-medium text-slate-700">
              Hero Title
              <input
                value={aboutPageHero.aboutHeroTitle}
                onChange={(e) => updateAboutPageHero("aboutHeroTitle", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">About Page Main Section</h2>
          <p className="mt-1 text-sm text-slate-500">
            Controls the main heading, paragraphs, and image in the About page intro section.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Section Kicker
              <input
                value={aboutPageContent.aboutMainKicker}
                onChange={(e) => updateAboutPageContent("aboutMainKicker", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="md:col-span-2 block text-sm font-medium text-slate-700">
              Main Heading
              <textarea
                rows={2}
                value={aboutPageContent.aboutMainHeading}
                onChange={(e) => updateAboutPageContent("aboutMainHeading", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="md:col-span-2 block text-sm font-medium text-slate-700">
              Paragraph One
              <textarea
                rows={3}
                value={aboutPageContent.aboutMainParagraphOne}
                onChange={(e) => updateAboutPageContent("aboutMainParagraphOne", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="md:col-span-2 block text-sm font-medium text-slate-700">
              Paragraph Two
              <textarea
                rows={3}
                value={aboutPageContent.aboutMainParagraphTwo}
                onChange={(e) => updateAboutPageContent("aboutMainParagraphTwo", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>

            <label className="md:col-span-2 block text-sm font-medium text-slate-700">
              Paragraph Three
              <textarea
                rows={3}
                value={aboutPageContent.aboutMainParagraphThree}
                onChange={(e) => updateAboutPageContent("aboutMainParagraphThree", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              />
            </label>
          </div>

          <article className="mt-5 rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-800">About Page Main Image</p>
            <p className="mt-1 text-xs text-slate-500">Image shown on the right side of the About page intro section.</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleAboutPageImageChange}
              className="mt-3 block w-full text-sm"
            />
            {aboutPageImagePreview && (
              <img
                src={aboutPageImagePreview}
                alt="About page main preview"
                className="mt-3 h-36 w-full rounded-lg border border-slate-200 object-cover"
              />
            )}
          </article>
        </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">About Page Mission & Vision</h2>
            <p className="mt-1 text-sm text-slate-500">
              Controls the Mission and Vision cards shown below the About intro section.
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">Mission Card</p>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Kicker
                  <input
                    value={aboutPageContent.aboutMissionKicker}
                    onChange={(e) => updateAboutPageContent("aboutMissionKicker", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Title
                  <input
                    value={aboutPageContent.aboutMissionTitle}
                    onChange={(e) => updateAboutPageContent("aboutMissionTitle", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Description
                  <textarea
                    rows={3}
                    value={aboutPageContent.aboutMissionDescription}
                    onChange={(e) => updateAboutPageContent("aboutMissionDescription", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>
              </article>

              <article className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">Vision Card</p>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Kicker
                  <input
                    value={aboutPageContent.aboutVisionKicker}
                    onChange={(e) => updateAboutPageContent("aboutVisionKicker", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Title
                  <input
                    value={aboutPageContent.aboutVisionTitle}
                    onChange={(e) => updateAboutPageContent("aboutVisionTitle", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Description
                  <textarea
                    rows={3}
                    value={aboutPageContent.aboutVisionDescription}
                    onChange={(e) => updateAboutPageContent("aboutVisionDescription", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                  />
                </label>
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">About Page Teams Section</h2>
                <p className="mt-1 text-sm text-slate-500">Controls the Our Teams heading and all team cards.</p>
              </div>
              <button type="button" onClick={addAboutTeam} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                Add Team Card
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Section Kicker
                <input
                  value={aboutPageContent.aboutTeamKicker}
                  onChange={(e) => updateAboutPageContent("aboutTeamKicker", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>

              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Section Heading
                <textarea
                  rows={2}
                  value={aboutPageContent.aboutTeamHeading}
                  onChange={(e) => updateAboutPageContent("aboutTeamHeading", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
            </div>

            <div className="mt-4 space-y-3">
              {aboutPageContent.aboutTeams.map((item, index) => (
                <div key={`${item.role}-${index}`} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-5">
                  <input
                    value={item.count}
                    onChange={(e) => updateAboutTeam(index, "count", e.target.value)}
                    placeholder="Count (e.g. 45+)"
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  />
                  <input
                    value={item.role}
                    onChange={(e) => updateAboutTeam(index, "role", e.target.value)}
                    placeholder="Role (e.g. Project Engineering)"
                    className="md:col-span-3 rounded-lg border border-slate-200 px-3 py-2"
                  />
                  <button type="button" onClick={() => removeAboutTeam(index)} className="rounded-lg border border-red-200 px-3 py-2 text-red-600">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">About Page Office Section</h2>
            <p className="mt-1 text-sm text-slate-500">
              Controls the Office Locations card at the bottom of the About page.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Section Kicker
                <input
                  value={aboutPageContent.aboutOfficeKicker}
                  onChange={(e) => updateAboutPageContent("aboutOfficeKicker", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Registered Office Title
                <input
                  value={aboutPageContent.aboutRegisteredOfficeTitle}
                  onChange={(e) => updateAboutPageContent("aboutRegisteredOfficeTitle", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Corporate Office Title
                <input
                  value={aboutPageContent.aboutCorporateOfficeTitle}
                  onChange={(e) => updateAboutPageContent("aboutCorporateOfficeTitle", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Registered Office Address
                <textarea
                  rows={4}
                  value={aboutPageContent.aboutRegisteredOfficeAddress}
                  onChange={(e) => updateAboutPageContent("aboutRegisteredOfficeAddress", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Corporate Office Address
                <textarea
                  rows={4}
                  value={aboutPageContent.aboutCorporateOfficeAddress}
                  onChange={(e) => updateAboutPageContent("aboutCorporateOfficeAddress", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </label>
            </div>
          </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Homepage Images</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update key image areas visible on the public home page.
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">
            Cloudinary is optional. Local uploads are used when not configured.
          </p>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">Landing Hero Image</p>
              <p className="mt-1 text-xs text-slate-500">Main background of the hero section.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange("hero", e)}
                className="mt-3 block w-full text-sm"
              />
              {imagePreview.hero && (
                <img src={imagePreview.hero} alt="Hero preview" className="mt-3 h-32 w-full rounded-lg border border-slate-200 object-cover" />
              )}
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">About Section Image</p>
              <p className="mt-1 text-xs text-slate-500">Image shown in the home about preview area.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange("about", e)}
                className="mt-3 block w-full text-sm"
              />
              {imagePreview.about && (
                <img src={imagePreview.about} alt="About preview" className="mt-3 h-32 w-full rounded-lg border border-slate-200 object-cover" />
              )}
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">CTA Banner Image</p>
              <p className="mt-1 text-xs text-slate-500">Bottom call-to-action section image.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange("cta", e)}
                className="mt-3 block w-full text-sm"
              />
              {imagePreview.cta && (
                <img src={imagePreview.cta} alt="CTA preview" className="mt-3 h-32 w-full rounded-lg border border-slate-200 object-cover" />
              )}
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Stats</h2>
            <button type="button" onClick={addStat} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              Add Stat
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-4">
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  placeholder="Label"
                  className="rounded-lg border border-slate-200 px-3 py-2"
                />
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  type="number"
                  placeholder="Value"
                  className="rounded-lg border border-slate-200 px-3 py-2"
                />
                <input
                  value={stat.suffix}
                  onChange={(e) => updateStat(index, "suffix", e.target.value)}
                  placeholder="Suffix"
                  className="rounded-lg border border-slate-200 px-3 py-2"
                />
                <button type="button" onClick={() => removeStat(index)} className="rounded-lg border border-red-200 px-3 py-2 text-red-600">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>


        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Marquee Text</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter comma-separated clients. Use Name|LogoURL format for logo control from CMS.
            Example: Google|https://logo.clearbit.com/google.com, Microsoft|https://logo.clearbit.com/microsoft.com
          </p>
          <textarea
            rows={3}
            value={marqueeText}
            onChange={(e) => setMarqueeText(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </section>

        <button
          type="submit"
          disabled={saving || loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Homepage"}
        </button>
      </form>
    </div>
  );
}
