import { motion as Motion } from "framer-motion";

const NODE_POS = [
  { x: "8%", y: "22%" },
  { x: "22%", y: "12%" },
  { x: "38%", y: "28%" },
  { x: "52%", y: "14%" },
  { x: "68%", y: "26%" },
  { x: "84%", y: "18%" },
  { x: "14%", y: "58%" },
  { x: "30%", y: "72%" },
  { x: "48%", y: "62%" },
  { x: "64%", y: "76%" },
  { x: "78%", y: "54%" },
  { x: "92%", y: "68%" },
];

export function HeroNetwork() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.22] md:opacity-[0.28]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hero-net-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <Motion.path
          d="M 0 35 Q 25 20 50 40 T 100 30"
          fill="none"
          stroke="url(#hero-net-line)"
          strokeWidth="0.35"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
        />
        <Motion.path
          d="M 0 70 Q 30 55 55 75 T 100 65"
          fill="none"
          stroke="url(#hero-net-line)"
          strokeWidth="0.28"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.8, delay: 0.2, ease: "easeInOut" }}
        />
        <Motion.path
          d="M 15 0 L 40 100 M 70 0 L 55 100 M 90 15 L 20 85"
          fill="none"
          stroke="url(#hero-net-line)"
          strokeWidth="0.2"
          vectorEffect="non-scaling-stroke"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.2, delay: 0.35, ease: "easeInOut" }}
        />
      </svg>

      {NODE_POS.map((pos, i) => (
        <Motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full md:h-2.5 md:w-2.5"
          style={{
            left: pos.x,
            top: pos.y,
            marginLeft: "-4px",
            marginTop: "-4px",
            background: "radial-gradient(circle, rgba(37,99,235,0.75) 0%, rgba(34,197,94,0.35) 100%)",
            boxShadow: "0 0 12px rgba(37,99,235,0.35)",
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.35, 0.85, 0.35],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3.5 + (i % 4) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
