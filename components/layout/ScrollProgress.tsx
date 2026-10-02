"use client";

import { m, useScroll } from "framer-motion";

/** Thin blue reading-progress bar pinned to the very top of the page. */
export function ScrollProgress() {
  // Lenis already smooths the scroll position, so no extra spring is needed.
  const { scrollYProgress: scaleX } = useScroll();

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[85] h-[2px] origin-left bg-accent shadow-[0_0_12px_rgba(59,130,246,0.7)]"
      style={{ scaleX }}
    />
  );
}
