"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { cn, numberFormat } from "@/lib/text";
import { ChartTable } from "./ChartTable";
import { CHART } from "./useChartSize";

type Segment = { label: string; value: number };

const SIZE = 220;
const R = 88;
const STROKE = 22;
const GAP = 2; // px of surface between segments

function arc(start: number, end: number) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const p = (a: number) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const [x0, y0] = p(start);
  const [x1, y1] = p(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M${x0.toFixed(3)},${y0.toFixed(3)} A${R},${R} 0 ${large} 1 ${x1.toFixed(3)},${y1.toFixed(3)}`;
}

export function DonutChart({
  segments,
  total,
  title,
  unitLabel = "students",
  showTable = false,
}: {
  segments: Segment[];
  total: number;
  title: string;
  unitLabel?: string;
  showTable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const draw = inView || reduce;

  const gapAngle = GAP / R;
  let cursor = -Math.PI / 2;
  const arcs = segments.map((s, i) => {
    const share = s.value / total;
    const start = cursor + gapAngle / 2;
    const end = cursor + share * Math.PI * 2 - gapAngle / 2;
    const startShare = (cursor + Math.PI / 2) / (Math.PI * 2);
    cursor += share * Math.PI * 2;
    return { ...s, d: arc(start, end), share, startShare, color: CHART.ordinal[i % CHART.ordinal.length] };
  });

  const pct = (share: number) => `${(share * 100).toFixed(1)}%`;
  const active = hover !== null ? arcs[hover] : null;
  const summary = `${title}: ${arcs.map((a) => `${a.label} ${numberFormat.format(a.value)} (${pct(a.share)})`).join(", ")}.`;

  return (
    <div ref={ref}>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
        <div className="relative w-full max-w-[220px] shrink-0">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={summary} className="block h-auto w-full">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth={STROKE} />
            {arcs.map((a, i) => (
              <m.path
                key={a.label}
                d={a.d}
                fill="none"
                stroke={a.color}
                strokeWidth={STROKE}
                strokeLinecap="butt"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: draw ? 1 : 0, opacity: hover === null || hover === i ? 1 : 0.32 }}
                transition={{
                  pathLength: { duration: reduce ? 0 : Math.max(0.15, a.share * 1.4), delay: reduce ? 0 : a.startShare * 1.4, ease: "linear" },
                  opacity: { duration: 0.25 },
                }}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              />
            ))}
          </svg>
          {/* Centre readout doubles as the hover tooltip */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {active ? (
              <>
                <span className="mono text-[11px] uppercase tracking-[0.16em] text-muted">Grade {active.label}</span>
                <span className="font-display text-[26px] font-medium tracking-[-0.02em] text-text">{numberFormat.format(active.value)}</span>
                <span className="mono text-[11px] text-muted">{pct(active.share)}</span>
              </>
            ) : (
              <>
                <span className="font-display text-[26px] font-medium tracking-[-0.02em] text-text">{numberFormat.format(total)}</span>
                <span className="mono text-[11px] uppercase tracking-[0.16em] text-muted">{unitLabel}</span>
              </>
            )}
          </div>
        </div>

        {/* Legend: always present for multiple series; values double as direct labels */}
        <ul className="grid w-full grid-cols-2 gap-x-6 sm:grid-cols-1" aria-label="Legend">
          {arcs.map((a, i) => (
            <li
              key={a.label}
              tabIndex={0}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={cn(
                "flex min-h-9 items-center gap-3 border-b border-border py-1.5 text-[13px] transition-opacity duration-300",
                hover !== null && hover !== i && "opacity-45",
              )}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: a.color }} aria-hidden="true" />
              <span className="font-display w-5 text-text">{a.label}</span>
              <span className="ml-auto tabular-nums text-text">{numberFormat.format(a.value)}</span>
              <span className="mono w-12 text-right text-[11.5px] tabular-nums text-muted">{pct(a.share)}</span>
            </li>
          ))}
        </ul>
      </div>
      <ChartTable
        caption={title}
        columns={["Grade", "Students", "Share"]}
        rows={arcs.map((a) => [a.label, numberFormat.format(a.value), pct(a.share)])}
        visible={showTable}
      />
    </div>
  );
}
