"use client";

import {
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { numberFormat, splitWords } from "@/lib/text";
import { WordParts } from "@/components/ui/WordParts";

export const EASE = [0.22, 1, 0.36, 1] as const;

const tags = {
  div: m.div,
  section: m.section,
  header: m.header,
  article: m.article,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  p: m.p,
} as const;
type Tag = keyof typeof tags;

/** Fades content up with a slight blur-to-sharp, once, when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
  amount?: number;
}) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const wordVariants: Variants = {
  hidden: { y: "105%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 1.05, ease: EASE } },
};

/** Heading that reveals word by word. Supports *accent* words and [PLACEHOLDER] marks. */
export function RevealHeading({
  text,
  as: As = "h2",
  className,
  delay = 0,
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const words = splitWords(text);
  return (
    <As className={className} id={id}>
      <m.span
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.055, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            {word.space && " "}
            <span className="word-mask">
              <m.span variants={wordVariants} className="inline-block">
                <WordParts parts={word.parts} />
              </m.span>
            </span>
          </Fragment>
        ))}
      </m.span>
    </As>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/** Children wrapped in <StaggerItem> animate in one after another. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: Tag;
  amount?: number;
}) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      custom={{ stagger, delay }}
      variants={containerVariants}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Comp = tags[as] as typeof m.div;
  return (
    <Comp className={className} variants={itemVariants}>
      {children}
    </Comp>
  );
}

/**
 * Image container that scales gently in when revealed and drifts with a subtle
 * parallax while scrolling. Put a <SmartImage fill /> inside.
 */
export function ImageReveal({
  children,
  className,
  parallax = 40,
  overlay,
}: {
  children: ReactNode;
  className?: string;
  /** Max parallax offset in px (0 disables). */
  parallax?: number;
  /** Content layered above the image (e.g. captions), outside the parallax layer. */
  overlay?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);
  const useParallax = !reduce && parallax > 0;

  return (
    <div ref={ref} className={className}>
      <m.div
        className="absolute inset-x-0"
        style={{
          top: useParallax ? -parallax : 0,
          bottom: useParallax ? -parallax : 0,
          y: useParallax ? y : 0,
        }}
      >
        <m.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: EASE }}
        >
          {children}
        </m.div>
      </m.div>
      {overlay}
    </div>
  );
}

/** Counts up from 0 when scrolled into view. Renders the final value without JS. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const final = `${prefix}${numberFormat.format(value)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = `${prefix}0${suffix}`;
      return;
    }
    // A tiny rAF loop (ease-out expo) instead of pulling in the full animation engine.
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = `${prefix}${numberFormat.format(Math.round(value * eased))}${suffix}`;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, prefix, suffix, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
