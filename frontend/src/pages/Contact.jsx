import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Reveal } from "../components/common/Reveal";
import { Seo } from "../components/common/Seo";
import { PageWrapper } from "../components/layout/PageWrapper";
import { fetchSettings, submitContact } from "../lib/publicApi";

const fallbackSettings = {
  siteName: "BRANDLINA LLP",
  supportEmail: "brandlina33@gmail.com",
  contactPhone: "+91 76679 26063",
  address: "Ranchi, Jharkhand",
};

export default function Contact() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const data = await fetchSettings();
        if (mounted && data) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // Keep static fallback settings.
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Name, email and requirements are required");
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        ...form,
        inquiryType: "contact",
        sourcePage: "contact_page",
      });
      toast.success("Inquiry submitted successfully");
      setForm({ name: "", email: "", company: "", phone: "", message: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <Seo
        title="Contact | BRANDLINA LLP"
        description="Contact BRANDLINA LLP for fire systems, CCTV, networking, HVAC and turnkey infrastructure solutions."
      />

      <section className="page-container py-12 md:py-16">
        <Reveal>
          <p className="section-kicker">Contact</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-bold leading-tight tracking-tight text-[#1e293b] sm:text-4xl md:text-6xl">
            Let’s discuss your next infrastructure build.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted md:text-lg">
            Share your project requirement and our team will revert with a structured scope,
            timeline expectation, and implementation approach.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="glass-card p-7 md:p-9">
            <h2 className="text-2xl font-bold text-[#1e293b]">Send us a message</h2>
            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="float-field md:col-span-1">
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  placeholder=" "
                  autoComplete="name"
                  className="form-input"
                />
                <label htmlFor="contact-name" className="float-label">
                  Your Name
                </label>
              </div>
              <div className="float-field md:col-span-1">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder=" "
                  autoComplete="email"
                  className="form-input"
                />
                <label htmlFor="contact-email" className="float-label">
                  Work Email
                </label>
              </div>
              <div className="float-field md:col-span-1">
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={onChange}
                  placeholder=" "
                  autoComplete="organization"
                  className="form-input"
                />
                <label htmlFor="contact-company" className="float-label">
                  Company / Organization
                </label>
              </div>
              <div className="float-field md:col-span-1">
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  placeholder=" "
                  autoComplete="tel"
                  className="form-input"
                />
                <label htmlFor="contact-phone" className="float-label">
                  Phone Number
                </label>
              </div>
              <div className="float-field md:col-span-2">
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={onChange}
                  placeholder=" "
                  className="form-input resize-none"
                />
                <label htmlFor="contact-message" className="float-label">
                  Project requirements
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center md:col-span-2 disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </Reveal>

          <div className="flex flex-col gap-8">
            <Reveal className="glass-card p-7 md:p-9" delay={0.05}>
              <h2 className="text-2xl font-bold text-[#1e293b]">{settings.siteName}</h2>

              <div className="mt-6 space-y-6 text-sm text-text-muted">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1e293b]">Registered Office</p>
                  <p className="mt-2 leading-relaxed">
                    E type 196, HEC Dhurwa Sector-2
                    <br />
                    Dhurwa, Ranchi, Jharkhand (834004)
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1e293b]">Corporate Office</p>
                  <p className="mt-2 leading-relaxed">
                    207/A Nandan enclave Tupudana
                    <br />
                    Ranchi Jharkhand (835221)
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1e293b]">Phone</p>
                  <div className="mt-2 flex flex-col gap-1">
                    <a
                      href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                      className="footer-link font-medium text-[#1e293b] hover:text-[var(--accent)]"
                    >
                      {settings.contactPhone}
                    </a>
                    <a href="tel:+919546628385" className="footer-link font-medium text-[#1e293b] hover:text-[var(--accent)]">
                      9546628385
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1e293b]">Email</p>
                  <a href={`mailto:${settings.supportEmail}`} className="footer-link mt-2 inline-block font-medium">
                    {settings.supportEmail}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1e293b]">Primary Address</p>
                  <p className="mt-2 leading-relaxed">{settings.address}</p>
                </div>
              </div>
            </Reveal>

            <Reveal className="overflow-hidden rounded-2xl border border-[rgba(37,99,235,0.12)] shadow-[0_20px_48px_-20px_rgba(30,64,175,0.15)]" delay={0.1}>
              <iframe
                title="Brandlina office location"
                src="https://www.google.com/maps?q=Ranchi%20Jharkhand&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full md:h-[380px]"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
