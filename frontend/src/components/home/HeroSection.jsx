import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { landingTheme } from "../../data/landingTheme";
import { staggerItem, staggerParent } from "../common/motionVariants";
import { HeroNetwork } from "./HeroNetwork";
import { HeroWebGLBackground } from "./HeroWebGLBackground";

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2675&q=80";

function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export function HeroSection({ hero }) {
  const content = { ...landingTheme.hero, ...(hero || {}) };
  const c200 = useCountUp(200, 1600);
  const c70 = useCountUp(70, 1400);
  const c100 = useCountUp(100, 1800);

  return (
    <section className="relative isolate overflow-x-hidden pt-4 pb-8 md:pt-8 md:pb-24">
      <div className="page-container relative z-10 flex w-full min-h-[min(100svh,920px)] flex-col justify-start gap-8 py-6 md:min-h-[82vh] md:justify-between md:gap-10 md:py-8">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[1.5rem] shadow-[0_24px_80px_-20px_rgba(30,64,175,0.25)] md:rounded-[2.5rem]">
          <div className="hero-gradient-anim absolute inset-0 z-0" aria-hidden />
          <img
            src={content.backgroundImage || fallbackHeroImage}
            alt="Modern Architecture"
            data-gsap-parallax="hero"
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-[#1d4ed8]/[0.09] via-transparent to-[#22c55e]/[0.14]" />
          <HeroWebGLBackground />
          <div className="absolute inset-0 z-[3]">
            <HeroNetwork />
          </div>
          <div className="absolute inset-0 z-[4] bg-gradient-to-r from-white/92 via-white/50 to-white/12" />
          <div className="absolute inset-0 z-[5] bg-gradient-to-t from-[#f8fafc]/88 via-transparent to-white/25" />
        </div>

        <Motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="relative z-20 flex max-w-5xl flex-col items-start justify-start px-5 pb-2 pt-16 sm:px-6 md:px-16 md:pb-2 md:pt-14 lg:pt-16"
        >
          <Motion.h1
            variants={staggerItem}
            className="hero-text-reveal max-w-2xl py-1 text-[2.35rem] font-bold uppercase leading-[1.12] tracking-tight text-[#0f172a] sm:text-5xl sm:leading-[1.1] md:max-w-4xl md:text-6xl md:leading-[1.08] lg:text-7xl lg:leading-[1.06]"
          >
            {content.titleLineOne} <br /> {content.titleLineTwo}{" "}
            <span className="hero-heading-highlight">
              {content.titleAccent}
            </span>
          </Motion.h1>

          <Motion.p
            variants={staggerItem}
            className="hero-text-reveal mt-4 max-w-xl text-base font-medium leading-relaxed text-[#334155] sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
          >
            {content.subtitle}
          </Motion.p>

          <Motion.div
            variants={staggerItem}
            className="hero-text-reveal mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-7"
          >
            <Link
              to="/services"
              className="hero-cta-motion inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_36px_rgba(37,99,235,0.3)] transition-transform hover:scale-[1.02] hover:shadow-[0_18px_44px_rgba(37,99,235,0.38)]"
            >
              {content.ctaPrimary || "Explore Services"}
              <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-white text-[var(--accent)]">
                ↗
              </span>
            </Link>
            <Link
              to="/contact"
              className="hero-cta-motion inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#22c55e]/70 bg-white/90 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[#0f172a] shadow-[0_10px_30px_rgba(34,197,94,0.18)] backdrop-blur-sm transition-all hover:border-[#16a34a] hover:bg-gradient-to-r hover:from-[rgba(34,197,94,0.12)] hover:to-[rgba(37,99,235,0.08)]"
            >
              {content.inputButton || "Get Quote"}
              <span className="text-[#16a34a]" aria-hidden>
                →
              </span>
            </Link>
          </Motion.div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35 }}
          className="relative z-20 mt-2 w-full px-5 pb-8 pt-2 sm:px-6 md:mt-auto md:flex md:items-end md:justify-between md:px-16 md:pb-10 md:pt-4"
        >
          <div className="grid w-full grid-cols-3 gap-4 text-[#1e293b] md:flex md:w-auto md:gap-12 lg:gap-20">
            <div className="min-w-0">
              <h3 className="text-2xl font-light tabular-nums leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-[1.05]">
                {c200}
                <span className="text-xl sm:text-3xl">+</span>
              </h3>
              <p className="mt-1 text-[10px] font-medium tracking-wide text-[#64748b] sm:text-sm">Projects Complete</p>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-light tabular-nums leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-[1.05]">
                {c70}
                <span className="text-xl sm:text-3xl">+</span>
              </h3>
              <p className="mt-1 text-[10px] font-medium tracking-wide text-[#64748b] sm:text-sm">Happy Clients</p>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-light tabular-nums leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-[1.05]">
                {c100}
                <span className="text-lg sm:text-2xl">M+</span>
              </h3>
              <p className="mt-1 text-[10px] font-medium tracking-wide text-[#64748b] sm:text-sm">Project Value</p>
            </div>
          </div>


        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="hero-scroll-indicator absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 md:flex"
        >
          <span>Scroll</span>
          <span className="scroll-dot" aria-hidden />
        </Motion.div>
      </div>
    </section>
  );
}
