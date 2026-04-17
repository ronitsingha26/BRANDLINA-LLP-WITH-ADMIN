import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let gsapRegistered = false;

function ensureGsapPlugins() {
  if (typeof window === "undefined" || gsapRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsapRegistered = true;
}

export function usePremiumScrollMotion() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    ensureGsapPlugins();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompactViewport = window.matchMedia("(max-width: 900px)").matches;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("main section");

      sections.forEach((section, index) => {
        if (prefersReducedMotion) {
          gsap.set(section, { autoAlpha: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay: Math.min(index * 0.03, 0.16),
            ease: "power2.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      const heroText = gsap.utils.toArray(".hero-text-reveal");
      if (heroText.length > 0) {
        if (prefersReducedMotion) {
          gsap.set(heroText, { autoAlpha: 1, y: 0 });
        } else {
          gsap.fromTo(
            heroText,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              stagger: 0.14,
              ease: "power3.out",
              overwrite: "auto",
            },
          );
        }
      }

      const headingHighlight = gsap.utils.toArray(".hero-heading-highlight");
      if (headingHighlight.length > 0 && !prefersReducedMotion) {
        gsap.to(headingHighlight, {
          backgroundPosition: "220% center",
          duration: 6.5,
          ease: "none",
          repeat: -1,
        });
      }

      const heroCtas = gsap.utils.toArray(".hero-cta-motion");
      if (prefersReducedMotion) {
        gsap.set(heroCtas, { y: 0 });
      } else {
        heroCtas.forEach((button, index) => {
          gsap.to(button, {
            y: -4,
            duration: 1.9 + index * 0.24,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      }

      const heroParallax = gsap.utils.toArray('[data-gsap-parallax="hero"]');
      if (prefersReducedMotion || isCompactViewport) {
        gsap.set(heroParallax, { yPercent: 0 });
      } else {
        heroParallax.forEach((node) => {
          const triggerTarget = node.closest("section") || node;

          gsap.to(node, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: triggerTarget,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        });
      }

      const sectionParallax = gsap.utils.toArray('[data-gsap-parallax="section"]');
      if (prefersReducedMotion || isCompactViewport) {
        gsap.set(sectionParallax, { yPercent: 0 });
      } else {
        sectionParallax.forEach((node) => {
          gsap.to(node, {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: node,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [pathname]);
}
