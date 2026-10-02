"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { numberFormat } from "@/lib/text";
import { ChartTable } from "./ChartTable";
import { CHART, clamp, useElementWidth } from "./useChartSize";

type Bar = { label: string; sublabel?: string; value: number };

type Props = {
  bars: Bar[];
  title: string;
  valueLabel: string;
  orientation?: "vertical" | "horizontal";
  max: number;
  ticks: number[];
  height?: number;
  unit?: string;
  /** Decimal places for values, e.g. 1 so 58 shows as "58.0" to match the source data. */
  decimals?: number;
  showTable?: boolean;
};

const THICKNESS = 24; // bars never thicker than 24px
const RADIUS = 4; // rounded data end, square at the baseline

/** Bar path with only the data end rounded. */
function barPath(x: number, y: number, w: number, h: number, horizontal: boolean) {
  const r = Math.min(RADIUS, horizontal ? w : h, horizontal ? h / 2 : w / 2);
  if (horizontal) {
    return `M${x},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x} Z`;
  }
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

export function BarChart({
  bars,
  title,
  valueLabel,
  orientation = "vertical",
  max,
  ticks,
  height,
  unit = "",
  decimals = 0,
  showTable = false,
}: Props) {
  const fmt = (v: number) => (decimals > 0 ? v.toFixed(decimals) : numberFormat.format(v));
  const horizontal = orientation === "horizontal";
  const [ref, width] = useElementWidth<HTMLDivElement>(420);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const draw = inView || reduce;

  const h = height ?? (horizontal ? bars.length * 52 + 40 : 260);
  const pad = horizontal ? { top: 8, right: 44, bottom: 30, left: 78 } : { top: 28, right: 12, bottom: 50, left: 36 };
  const iw = Math.max(10, width - pad.left - pad.right);
  const ih = h - pad.top - pad.bottom;
  const band = (horizontal ? ih : iw) / bars.length;
  const thickness = Math.min(THICKNESS, band * 0.5);
  const scale = (v: number) => (v / max) * (horizontal ? iw : ih);

  const summary = `${title}: ${bars.map((b) => `${b.label}${b.sublabel ? ` (${b.sublabel})` : ""} ${fmt(b.value)}${unit}`).join(", ")}.`;

  const tip =
    hover === null
      ? null
      : horizontal
        ? { left: pad.left + scale(bars[hover].value), top: pad.top + band * hover + band / 2 - thickness / 2 - 8 }
        : { left: pad.left + band * hover + band / 2, top: pad.top + ih - scale(bars[hover].value) - 30 };

  return (
    <div>
      <div ref={ref} className="relative w-full select-none">
        <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} role="img" aria-label={summary} className="block w-full overflow-visible">
          {/* Hairline grid */}
          {ticks.map((t) =>
            horizontal ? (
              <g key={t}>
                <line x1={pad.left + scale(t)} x2={pad.left + scale(t)} y1={pad.top} y2={pad.top + ih} stroke={t === 0 ? CHART.axis : CHART.grid} shapeRendering="crispEdges" />
                <text x={pad.left + scale(t)} y={h - 8} textAnchor="middle" fontSize={11} fill={CHART.muted} className="mono tabular-nums">
                  {t}
                </text>
              </g>
            ) : (
              <g key={t}>
                <line x1={pad.left} x2={pad.left + iw} y1={pad.top + ih - scale(t)} y2={pad.top + ih - scale(t)} stroke={t === 0 ? CHART.axis : CHART.grid} shapeRendering="crispEdges" />
                <text x={pad.left - 10} y={pad.top + ih - scale(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={CHART.muted} className="mono tabular-nums">
                  {t}
                </text>
              </g>
            ),
          )}

          {bars.map((bar, i) => {
            const len = scale(bar.value);
            const active = hover === i;
            const bx = horizontal ? pad.left : pad.left + band * i + (band - thickness) / 2;
            const by = horizontal ? pad.top + band * i + (band - thickness) / 2 : pad.top + ih - len;
            const bw = horizontal ? len : thickness;
            const bh = horizontal ? thickness : len;
            return (
              <g key={bar.label}>
                <m.path
                  d={barPath(bx, by, bw, bh, horizontal)}
                  fill={active ? CHART.accentSoft : CHART.accent}
                  style={{ transformBox: "fill-box", transformOrigin: horizontal ? "left center" : "center bottom" }}
                  initial={horizontal ? { scaleX: 0 } : { scaleY: 0 }}
                  animate={horizontal ? { scaleX: draw ? 1 : 0 } : { scaleY: draw ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Value at the bar tip (text tokens, never the series colour) */}
                <m.text
                  x={horizontal ? bx + bw + 8 : bx + bw / 2}
                  y={horizontal ? by + bh / 2 : by - 9}
                  dy={horizontal ? "0.32em" : 0}
                  textAnchor={horizontal ? "start" : "middle"}
                  fontSize={13}
                  fontWeight={500}
                  fill={CHART.text}
                  className="tabular-nums"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: draw ? 1 : 0 }}
                  transition={{ delay: reduce ? 0 : 0.9 + i * 0.12 }}
                >
                  {fmt(bar.value)}
                </m.text>
                {/* Category labels */}
                {horizontal ? (
                  <text x={pad.left - 12} y={by + bh / 2} dy="0.32em" textAnchor="end" fontSize={12.5} fill={active ? CHART.text : CHART.muted}>
                    {bar.label}
                  </text>
                ) : (
                  <>
                    <text x={bx + bw / 2} y={pad.top + ih + 20} textAnchor="middle" fontSize={12.5} fill={active ? CHART.text : CHART.muted}>
                      {bar.label}
                    </text>
                    {bar.sublabel && (
                      <text x={bx + bw / 2} y={pad.top + ih + 37} textAnchor="middle" fontSize={10.5} fill={CHART.muted} className="mono">
                        {bar.sublabel}
                      </text>
                    )}
                  </>
                )}
                {/* Hit area: the whole band, bigger than the mark */}
                <rect
                  x={horizontal ? 0 : pad.left + band * i}
                  y={horizontal ? pad.top + band * i : pad.top}
                  width={horizontal ? width : band}
                  height={horizontal ? band : ih + 40}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>

        {tip && hover !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border-strong bg-[#0d1630]/95 px-3 py-2 shadow-xl backdrop-blur"
            style={{ left: clamp(tip.left, 60, width - 60), top: tip.top }}
          >
            <div className="font-display text-[15px] font-medium text-text tabular-nums">
              {fmt(bars[hover].value)}
              {unit}
            </div>
            <div className="mono flex items-center gap-1.5 whitespace-nowrap text-[10.5px] text-muted">
              <span className="inline-block h-0.5 w-3 rounded bg-accent" />
              {bars[hover].label}
              {bars[hover].sublabel ? ` · ${bars[hover].sublabel}` : ""}
            </div>
          </div>
        )}
      </div>
      <ChartTable
        caption={title}
        columns={["Category", valueLabel]}
        rows={bars.map((b) => [b.sublabel ? `${b.label} (${b.sublabel})` : b.label, fmt(b.value)])}
        visible={showTable}
      />
    </div>
  );
}
