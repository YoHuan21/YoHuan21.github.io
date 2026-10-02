import { marquee } from "@/data/content";
import { cn } from "@/lib/text";

// Varied elegant type styles, like the magazine logo strip in the reference.
const STYLES = [
  "font-serif italic text-[1.85rem] tracking-[-0.01em]",
  "font-display font-semibold uppercase tracking-[0.14em] text-[0.95rem]",
  "font-display font-extralight uppercase tracking-[0.34em] text-[0.95rem]",
  "font-mono text-[1rem] tracking-[-0.02em]",
  "font-display font-bold text-[1.35rem] tracking-[-0.045em]",
  "font-display font-light text-[1.3rem] tracking-[-0.02em]",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marquee.map((tool, i) => (
        <li
          key={tool}
          className={cn(
            "flex h-16 items-center whitespace-nowrap px-8 text-muted transition-colors duration-500 hover:text-text sm:px-12",
            STYLES[i % STYLES.length],
          )}
        >
          {tool}
        </li>
      ))}
    </ul>
  );
}

/** Slow, infinite marquee of tools. Pauses on hover; static for reduced motion. */
export function SkillsMarquee() {
  return (
    <section aria-label="Tools I work with" className="relative py-10 sm:py-14">
      <div className="marquee overflow-hidden">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
