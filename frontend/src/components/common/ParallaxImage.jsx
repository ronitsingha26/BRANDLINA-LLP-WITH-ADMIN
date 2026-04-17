import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxImage({
  src,
  alt,
  className = "",
  shift = 40,
  fit = "cover",
  zoom = true,
  imageClassName = "",
}) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift]);
  const scale = useTransform(scrollYProgress, [0, 1], zoom ? [1.08, 1] : [1, 1]);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      ref={targetRef}
      data-gsap-parallax="section"
      className={`relative overflow-hidden rounded-2xl border border-black/10 ${className}`}
    >
      <Motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full ${fitClass} ${imageClassName}`.trim()}
        style={{ y, scale }}
      />
    </div>
  );
}
