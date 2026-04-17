import { useEffect, useState } from "react";
import { Reveal } from "../common/Reveal";

function CountUp({ value, suffix = "", duration = 1300 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrame;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const fallbackStats = [
  { label: "Projects Delivered", value: 500, suffix: "+" },
  { label: "Enterprise Clients", value: 200, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
  { label: "Support Availability", value: 24, suffix: "/7" },
];

export function StatsSection({ statsData }) {
  const stats = Array.isArray(statsData) && statsData.length > 0 ? statsData : fallbackStats;

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-white to-[#e2e8f0]/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2563eb]/35 to-transparent"
        aria-hidden
      />

      <div className="page-container relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.05}>
            <article className="relative overflow-hidden p-6 rounded-[1.125rem] border border-emerald-400/40 bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-[0_16px_42px_rgba(4,120,87,0.2)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(4,120,87,0.3)]">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.15),transparent_70%)]" />
              <p className="relative text-4xl font-semibold tabular-nums text-transparent md:text-5xl bg-gradient-to-br from-white to-yellow-400 bg-clip-text drop-shadow-sm">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="relative mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-white/90">
                {stat.label}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
