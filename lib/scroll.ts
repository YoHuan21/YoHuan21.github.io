import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smoothly scrolls to a section id (or the top when id is empty). */
export function scrollToId(id: string) {
  const target = id ? document.getElementById(id) : null;
  if (id && !target) return false;
  // Render every section for real so the target position is exact (see .cv in globals.css).
  document.documentElement.classList.add("cv-off");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sections carry scroll-margin-top (see globals.css), which both paths respect.
  if (lenis) {
    lenis.start();
    lenis.scrollTo(target ?? 0, { duration: 1.4, immediate: reduce });
  } else if (target) {
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
  // Move keyboard focus to the section for screen reader and keyboard users.
  if (target) {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  return true;
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
