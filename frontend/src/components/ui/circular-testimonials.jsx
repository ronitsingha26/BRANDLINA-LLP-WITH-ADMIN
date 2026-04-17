import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Inline SVG arrows (no extra dependency) ─────────────────── */
function ArrowLeft({ size = 20, color = "#f1f1f7" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ArrowRight({ size = 20, color = "#f1f1f7" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ── Gap calculation for the 3-image fan ─────────────────────── */
function calculateGap(width) {
  const minWidth = 400;
  const maxWidth = 900;
  const minGap = 36;
  const maxGap = 60;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return maxGap;
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

/* ── Main component ──────────────────────────────────────────── */
export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  // Colour & font config with sensible defaults
  const colorName         = colors.name            ?? "#1e293b";
  const colorDesignation  = colors.designation     ?? "#2563eb";
  const colorTestimony    = colors.testimony       ?? "#475569";
  const colorArrowBg      = colors.arrowBackground ?? "#1e293b";
  const colorArrowFg      = colors.arrowForeground ?? "#f8fafc";
  const colorArrowHover   = colors.arrowHoverBackground ?? "#2563eb";
  const fontSizeName      = fontSizes.name         ?? "1.35rem";
  const fontSizeRole      = fontSizes.designation  ?? "0.875rem";
  const fontSizeQuote     = fontSizes.quote        ?? "1rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev,   setHoverPrev]   = useState(false);
  const [hoverNext,   setHoverNext]   = useState(false);
  const [imgColWidth, setImgColWidth] = useState(400);

  // Refs
  const wrapperRef      = useRef(null);
  const imgContainerRef = useRef(null);
  const autoplayRef     = useRef(null);

  const INTERVAL_MS = 3000; // 3-second autoplay

  const total   = useMemo(() => testimonials.length, [testimonials]);
  const current = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  /* Measure image column width on resize */
  useEffect(() => {
    const observe = new ResizeObserver(() => {
      if (imgContainerRef.current) {
        setImgColWidth(imgContainerRef.current.offsetWidth);
      }
    });
    if (imgContainerRef.current) observe.observe(imgContainerRef.current);
    return () => observe.disconnect();
  }, []);

  /* Helper: start a fresh 3s interval */
  const startAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    if (!autoplay) return;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((p) => (p + 1) % total);
    }, INTERVAL_MS);
  }, [autoplay, total]);

  /* Boot autoplay on mount and when total changes */
  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [startAutoplay]);

  /* Manual nav — jumps slide AND restarts the 3s countdown */
  const handlePrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + total) % total);
    startAutoplay();
  }, [total, startAutoplay]);

  const handleNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % total);
    startAutoplay();
  }, [total, startAutoplay]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePrev, handleNext]);

  /* 3-image fan transform logic */
  function getImageStyle(index) {
    const gap      = calculateGap(imgColWidth);
    const stickUp  = gap * 0.75;
    const isActive = index === activeIndex;
    const isLeft   = (activeIndex - 1 + total) % total === index;
    const isRight  = (activeIndex + 1) % total === index;

    if (isActive) return {
      zIndex: 3, opacity: 1, pointerEvents: "auto",
      transform: "translateX(0) translateY(0) scale(1) rotateY(0deg)",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
    if (isLeft)  return {
      zIndex: 2, opacity: 1, pointerEvents: "auto",
      transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.86) rotateY(14deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
    if (isRight) return {
      zIndex: 2, opacity: 1, pointerEvents: "auto",
      transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.86) rotateY(-14deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
    return { zIndex: 1, opacity: 0, pointerEvents: "none",
             transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
  }

  /* Framer Motion variants */
  const slideVariants = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0  },
    exit:    { opacity: 0, y: -18 },
  };

  /* Arrow button shared style */
  function arrowStyle(hovered) {
    return {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      transition: "background-color 0.25s",
      backgroundColor: hovered ? colorArrowHover : colorArrowBg,
      flexShrink: 0,
    };
  }

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", maxWidth: "58rem" }}
    >
      <div
        style={{
          display: "grid",
          /* ── Images ALWAYS on LEFT, content on RIGHT ── */
          gridTemplateColumns: "1fr 1.3fr",
          gap: "3.5rem",
          alignItems: "center",
        }}
      >
        {/* ═══════════════ LEFT — image fan ═══════════════ */}
        <div
          ref={imgContainerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "17rem",       /* slightly smaller */
            perspective: "1000px",
          }}
        >
          {testimonials.map((t, i) => (
            <img
              key={t.src}
              src={t.src}
              alt={t.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                backgroundColor: "#ffffff",
                borderRadius: "1.25rem",
                boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                ...getImageStyle(i),
              }}
            />
          ))}
        </div>

        {/* ═══════════════ RIGHT — text content ═══════════════ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Name */}
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: fontSizeName,
                  color: colorName,
                  marginBottom: "0.2rem",
                  lineHeight: 1.2,
                }}
              >
                {current.name}
              </h3>

              {/* Role / designation */}
              <p
                style={{
                  fontSize: fontSizeRole,
                  color: colorDesignation,
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                  letterSpacing: "0.01em",
                }}
              >
                {current.designation}
              </p>

              {/* Quote with blur-in word animation */}
              <motion.p
                style={{
                  fontSize: fontSizeQuote,
                  lineHeight: 1.8,
                  color: colorTestimony,
                }}
              >
                {current.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: 0.022 * i }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Arrow buttons + indicators */}
          <div style={{ marginTop: "1.75rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button
                onClick={handlePrev}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                aria-label="Previous testimonial"
                style={arrowStyle(hoverPrev)}
              >
                <ArrowLeft size={18} color={colorArrowFg} />
              </button>
              <button
                onClick={handleNext}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                aria-label="Next testimonial"
                style={arrowStyle(hoverNext)}
              >
                <ArrowRight size={18} color={colorArrowFg} />
              </button>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.75rem" }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    startAutoplay();
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: i === activeIndex ? "1.5rem" : "0.5rem",
                    height: "0.5rem",
                    borderRadius: "99px",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.35s ease",
                    backgroundColor: i === activeIndex ? colorArrowBg : "rgba(30,64,175,0.18)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircularTestimonials;
