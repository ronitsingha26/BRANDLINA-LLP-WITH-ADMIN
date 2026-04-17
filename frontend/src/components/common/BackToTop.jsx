import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <Motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          onClick={scrollUp}
          aria-label="Back to top"
          className="fixed bottom-6 left-6 z-[58] flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(30,64,175,0.2)] bg-white/90 text-lg text-[#1e40af] shadow-[0_12px_32px_rgba(30,64,175,0.15)] backdrop-blur-md transition-colors hover:border-[#14b8a6] hover:text-[#14b8a6] md:bottom-8 md:left-8"
        >
          ↑
        </Motion.button>
      )}
    </AnimatePresence>
  );
}
