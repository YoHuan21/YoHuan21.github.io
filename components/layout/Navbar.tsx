"use client";

import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, site } from "@/data/content";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Icon } from "@/components/ui/Icon";
import { EASE } from "@/components/motion/Reveal";
import { lockScroll } from "@/lib/scroll";
import { cn, isPlaceholder } from "@/lib/text";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => media.matches && setOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[70]">
      {/* Background fades in on scroll (opacity only, no layout work). */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 border-b border-border bg-[rgba(5,7,13,0.62)] backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav aria-label="Primary" className="container-x relative flex h-[var(--nav-h)] items-center justify-between gap-6">
        <AnchorLink
          href="/"
          className="font-display -ml-1 inline-flex min-h-11 items-center px-1 text-[15px] font-medium tracking-[-0.01em] text-text"
        >
          {site.name}
        </AnchorLink>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <AnchorLink
                href={item.href}
                className="font-display inline-flex min-h-11 items-center rounded-full px-4 text-[13.5px] text-muted transition-colors duration-300 hover:text-accent-soft"
              >
                {item.label}
              </AnchorLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.resume}
            download={site.resumeDownloadName}
            className="pill pill-white pill-sm hidden sm:inline-flex"
          >
            Download Resume
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text transition-colors hover:text-accent-soft lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>{open && <MobileMenu onClose={close} />}</AnimatePresence>
    </header>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;
      // Keep focus inside the menu.
      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <m.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[75] flex flex-col bg-[rgba(5,7,13,0.97)] backdrop-blur-2xl lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div aria-hidden="true" className="glow-blue -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2" />
      <div className="container-x relative flex h-[var(--nav-h)] items-center justify-between">
        <span className="font-display text-[15px] font-medium tracking-[-0.01em]">{site.name}</span>
        <button
          type="button"
          data-autofocus
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text hover:text-accent-soft"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <nav aria-label="Mobile" className="container-x relative flex flex-1 flex-col justify-center">
        <ul className="flex flex-col">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-border">
              <m.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-40%", opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.08 + i * 0.06 }}
              >
                <AnchorLink
                  href={item.href}
                  onNavigate={onClose}
                  className="font-display flex min-h-16 items-center justify-between py-4 text-[clamp(2rem,9vw,3.25rem)] font-light tracking-[-0.03em] text-text transition-colors hover:text-accent-soft"
                >
                  {item.label}
                  <span className="mono text-xs text-muted">0{i + 1}</span>
                </AnchorLink>
              </m.div>
            </li>
          ))}
        </ul>
      </nav>

      <m.div
        className="container-x relative flex flex-wrap items-center justify-between gap-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
      >
        <a href={site.resume} download={site.resumeDownloadName} className="pill pill-white">
          <Icon name="download" size={16} />
          Download Resume
        </a>
        <div className="flex items-center gap-1">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-accent-soft">
            <Icon name="linkedin" size={20} />
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-accent-soft">
            <Icon name="github" size={20} />
          </a>
          {!isPlaceholder(site.email) && (
            <a href={`mailto:${site.email}`} aria-label="Email" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-accent-soft">
              <Icon name="mail" size={20} />
            </a>
          )}
        </div>
      </m.div>
    </m.div>
  );
}
