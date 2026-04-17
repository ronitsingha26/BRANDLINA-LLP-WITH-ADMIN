import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "../common/BackToTop";
import { FloatingWhatsApp } from "../common/FloatingWhatsApp";
import { applySiteTheme } from "../../data/siteTheme";
import { usePremiumScrollMotion } from "../../lib/usePremiumScrollMotion";

export function Layout({ children }) {
  usePremiumScrollMotion();

  useEffect(() => {
    applySiteTheme();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="relative flex w-full flex-1 flex-col">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
