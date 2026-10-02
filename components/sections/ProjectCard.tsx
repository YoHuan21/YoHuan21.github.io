"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import type { Project } from "@/data/content";
import { EASE } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/text";

const ITEMS = [
  { key: "problem", label: "Problem" },
  { key: "whatIDid", label: "What I did" },
  { key: "result", label: "Result" },
] as const;

const ADVANCE_MS = 5000;

type CardProject = Pick<Project, "slug" | "title" | "shortTitle" | "icon" | "type" | "context" | "story">;

/**
 * Split card (like the reference's "Core capabilities" blocks). The three story items
 * auto-advance every ~5s with a blue progress line; they're also clickable tabs.
 */
export function ProjectCard({
  project,
  index,
  visual,
}: {
  project: CardProject;
  index: number;
  visual: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reversed = index % 2 === 1;
  const auto = !reduce;
  const running = auto && inView && !paused;

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (event.key in keys) {
      event.preventDefault();
      select((i + keys[event.key] + ITEMS.length) % ITEMS.length, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(ITEMS.length - 1, true);
    }
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
  };

  return (
    <m.article
      ref={ref}
      className="card glow-hover"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.1, ease: EASE }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
      aria-labelledby={`${uid}-title`}
    >
      <div className="grid overflow-hidden rounded-[inherit] lg:grid-cols-[1.2fr_1fr]">
        {/* Visual side */}
        <div
          className={cn(
            "relative flex min-h-[340px] items-center justify-center overflow-hidden bg-[#060a16] px-5 py-12 sm:px-10 lg:min-h-[560px] lg:px-12",
            reversed && "lg:order-2",
          )}
        >
          <div aria-hidden="true" className="glow-blue left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-80" />
          <div aria-hidden="true" className="rays" />
          <div className="relative w-full max-w-[600px]">
            <div className="anim-float">{visual}</div>
          </div>
        </div>

        {/* Text side */}
        <div
          className={cn(
            "flex flex-col border-border p-7 sm:p-10 lg:p-12",
            reversed ? "lg:order-1 lg:border-r" : "lg:border-l",
            "border-t lg:border-t-0",
          )}
        >
          <div className="flex items-start gap-3">
            <span className="mt-1 text-accent-soft">
              <Icon name={project.icon} size={22} />
            </span>
            <h3 id={`${uid}-title`} className="title-sm">
              {project.title}
            </h3>
          </div>
          <p className="mono mt-3 text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {project.type} · {project.context}
          </p>

          {/* Cross-fading story text: all three share one grid cell, so height never jumps. */}
          <div
            className="mt-7 grid"
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${active}`}
          >
            {ITEMS.map((item, i) => (
              <p
                key={item.key}
                aria-hidden={i !== active}
                className={cn(
                  "body col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
                )}
              >
                <RichText text={project.story[item.key]} />
              </p>
            ))}
          </div>

          <div role="tablist" aria-label={`${project.shortTitle}: story`} className="mt-8">
            {ITEMS.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`${uid}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="group relative flex min-h-[52px] w-full items-center gap-4 text-left"
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-border" aria-hidden="true" />
                  {isActive && (
                    <span
                      key={`progress-${active}`}
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-px w-full origin-left bg-accent shadow-[0_0_8px_rgba(59,130,246,0.9)]"
                      style={
                        auto
                          ? {
                              animation: `progress ${ADVANCE_MS}ms linear both`,
                              animationPlayState: running ? "running" : "paused",
                            }
                          : undefined
                      }
                      onAnimationEnd={(e) => {
                        if (auto && e.animationName === "progress") setActive((a) => (a + 1) % ITEMS.length);
                      }}
                    />
                  )}
                  <span className={cn("mono text-[10.5px]", isActive ? "text-accent-soft" : "text-muted")}>0{i + 1}</span>
                  <span
                    className={cn(
                      "font-display text-[15px] transition-colors duration-300",
                      isActive ? "text-text" : "text-muted group-hover:text-text",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
            <span className="block h-px bg-border" aria-hidden="true" />
          </div>

          <div className="mt-auto pt-8">
            <Link href={`/work/${project.slug}/`} className="link-arrow">
              View case study
              <span className="sr-only">: {project.title}</span>
              <Icon name="arrowRight" size={18} className="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </m.article>
  );
}
