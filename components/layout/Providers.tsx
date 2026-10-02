"use client";

import type Lenis from "lenis";
import { LazyMotion, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getLenis, setLenis } from "@/lib/scroll";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Lenis smooth scrolling (skipped for reduced motion) + global Framer Motion config.
 * LazyMotion keeps the animation engine out of the initial bundle.
 */
export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let cancelled = false;

    // Loaded after hydration so smooth scrolling never delays the first paint.
    const start = async () => {
      if (media.matches || instance) return;
      const { default: LenisClass } = await import("lenis");
      if (cancelled || media.matches || instance) return;
      instance = new LenisClass({ autoRaf: true, lerp: 0.1, smoothWheel: true, stopInertiaOnNavigate: true });
      setLenis(instance);
    };
    const stop = () => {
      instance?.destroy();
      instance = null;
      setLenis(null);
    };
    const onChange = () => (media.matches ? stop() : start());

    start();
    media.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      media.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // New page: jump to the top, or to the section named in the URL (e.g. /#about).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      return;
    }
    // Arriving from another page: render all sections at their real size, then jump
    // straight to the target (Lenis resyncs from the native scroll event).
    let frame = 0;
    const timer = window.setTimeout(() => {
      document.documentElement.classList.add("cv-off");
      frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
        getLenis()?.resize();
      });
    }, 60);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
