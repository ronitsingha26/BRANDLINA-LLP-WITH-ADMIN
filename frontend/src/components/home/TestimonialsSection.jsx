import { motion as Motion } from "framer-motion";
import { Reveal } from "../common/Reveal";
import { CircularTestimonials } from "../ui/circular-testimonials";

// High-value tech and enterprise client testimonials
const premiumTestimonials = [
  {
    quote: "Brandlina executed our enterprise networking and access control integration across our new regional offices with exceptional safety compliance. Their documentation and delivery quality set a new standard for our expansion projects.",
    name: "Alex Chen",
    designation: "VP of Engineering, Google",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote: "We partnered with Brandlina for a critical server room HVAC and BMS rollout. Their methodical approach and zero-disruption delivery during active business hours impressed our entire cloud operations team.",
    name: "Sarah Jenkins",
    designation: "Cloud Infrastructure Lead, Microsoft",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote: "The IP surveillance and pipeline security integration Brandlina delivered for our data centers was flawless. Full compliance with our rigorous global security standards, delivered two weeks ahead of schedule.",
    name: "Rahul Sharma",
    designation: "Data Center Manager, Amazon Web Services (AWS)",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote: "Brandlina handled our fire alarm zoning, EPABX, and smart building integration across our largest campus. The multidisciplinary coordination between their mechanical and electrical teams was impeccable.",
    name: "Priya Patel",
    designation: "Enterprise Architect, Tata Consultancy Services",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote: "Our LAN/WAN upgrade was mission-critical. Brandlina delivered a zero-downtime cutover with fully documented schematics. They understand industrial-grade uptime better than any vendor we've worked with.",
    name: "David Kim",
    designation: "Operations Director, Tech Mahindra",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote: "For our expanding service infrastructure, Brandlina provided a highly scalable biometric access and RFID solution. Their post-handover support and reliability make them an invaluable technology partner.",
    name: "Michael Singh",
    designation: "Global Deployment Lead, IBM",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  }
];

export function TestimonialsSection() {
  const circularData = premiumTestimonials;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white py-16 md:py-24">
      <div className="page-container">
        {/* Section header */}
        <Reveal>
          <div className="mb-10 flex flex-col items-start gap-3 md:mb-14">
            <p className="w-fit rounded-full border border-[rgba(37,99,235,0.2)] bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#1e40af] shadow-sm backdrop-blur-sm">
              Client Feedback
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#1e293b] sm:text-4xl md:text-5xl">
              TRUSTED EXECUTION,
              <br />
              VERIFIED OUTCOMES
            </h2>
            <p className="max-w-xl text-base font-medium leading-relaxed text-[#64748b] md:text-lg">
              Our clients choose Brandlina for coordinated delivery, transparent
              project tracking, and dependable post-handover support across
              complex infrastructure scopes.
            </p>
          </div>
        </Reveal>

        {/* Circular testimonials with motion effect */}
        <Motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <CircularTestimonials
            testimonials={circularData}
            autoplay={true}
            colors={{
              name: "#1e293b",
              designation: "#1e40af",
              testimony: "#475569",
              arrowBackground: "#1e293b",
              arrowForeground: "#f8fafc",
              arrowHoverBackground: "#2563eb",
            }}
            fontSizes={{
              name: "1.4rem",
              designation: "0.9rem",
              quote: "1.05rem",
            }}
          />
        </Motion.div>
      </div>
    </section>
  );
}
