import { motion as Motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Reveal } from "../common/Reveal";
import { submitContact } from "../../lib/publicApi";

const fallbackCtaImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

export function CtaBannerSection({ bannerImage }) {
  const imageSource = bannerImage || fallbackCtaImage;
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Name, email and project brief are required");
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        ...form,
        inquiryType: "book_call",
        sourcePage: "home_cta",
      });

      toast.success("Call request submitted successfully");
      setForm(initialForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit call request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-[#e2e8f0]/50 pb-16 pt-8 text-center md:pb-32 md:pt-12">
      <div className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_70%)]" aria-hidden />
      <div className="page-container relative z-20 mx-auto max-w-7xl px-4">
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-[#dbeafe]/90 via-white to-[#ccfbf1]/40 shadow-[0_24px_64px_-18px_rgba(30,64,175,0.22)] backdrop-blur-sm md:rounded-[2.5rem]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(245,158,11,0.08),transparent_50%)]" aria-hidden />
          <div className="px-6 pb-10 pt-16 md:px-12 md:pt-20">
            <Motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mx-auto mb-7 block w-fit rounded-full border border-[rgba(37,99,235,0.25)] bg-white/85 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-[#1e40af] shadow-sm backdrop-blur-sm"
            >
              Get in Touch
            </Motion.span>

            <Reveal delay={0.2}>
              <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight text-[#1e293b] sm:text-4xl md:text-6xl">
                LET'S MAKE YOUR NEXT
                <br />
                INFRASTRUCTURE DELIVERY EFFORTLESS
              </h2>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-relaxed text-[#64748b]">
                Have questions or ready to move forward? From design and planning to deployment and handover, our team helps you execute with clarity, speed, and accountability.
              </p>
            </Reveal>
          </div>

          <Motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-x-10 gap-y-8 rounded-[1.2rem] border border-white/90 bg-white/90 p-5 text-left shadow-[0_20px_48px_-16px_rgba(30,64,175,0.15)] backdrop-blur-xl sm:p-7 md:grid-cols-2 md:rounded-[1.8rem] md:p-10"
          >
            <label className="block text-sm font-semibold text-[#334155]">
              Full Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[#1e293b] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[rgba(20,184,166,0.2)]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#334155]">
              Company / Organization
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[#1e293b] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[rgba(20,184,166,0.2)]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#334155]">
              Work Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[#1e293b] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[rgba(20,184,166,0.2)]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#334155]">
              Phone
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[#1e293b] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[rgba(20,184,166,0.2)]"
              />
            </label>

            <label className="block text-sm font-semibold text-[#334155] md:col-span-2">
              Project Brief
              <textarea
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[#1e293b] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[rgba(20,184,166,0.2)]"
              />
            </label>

            <div className="md:col-span-2">
              <Motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gradient-to-r from-[#1e40af] to-[#2563eb] py-4 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_rgba(37,99,235,0.38)] transition-opacity hover:opacity-95 disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Book a Call"}
              </Motion.button>
            </div>
          </Motion.form>

          <div className="relative mt-10 h-[220px] w-full overflow-hidden sm:h-[280px] md:h-[360px]">
            <img
              src={imageSource}
              alt="Modern architecture"
              className="premium-image-zoom h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/45 to-transparent" />
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
