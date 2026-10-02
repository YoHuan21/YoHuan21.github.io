"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChartTable } from "./ChartTable";
import { CHART, clamp, useElementWidth, useSvgId } from "./useChartSize";

type Point = { label: string; value: number };

type Props = {
  points: Point[];
  title: string;
  xLabel: string;
  yLabel: string;
  height?: number;
  yMax?: number;
  yTicks?: number[];
  /** Smaller margins and labels for use inside the home page cards. */
  compact?: boolean;
  /** Show a visible "View data" table under the chart. */
  showTable?: boolean;
  xUnit?: string;
  surface?: string;
};

export function LineChart({
  points,
  title,
  xLabel,
  yLabel,
  height = 280,
  yMax = 100,
  yTicks = [0, 25, 50, 75, 100],
  compact = false,
  showTable = false,
  xUnit = "h/day",
  surface = CHART.surface,
}: Props) {
  const [ref, width] = useElementWidth<HTMLDivElement>(compact ? 480 : 640);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useSvgId("area");

  const pad = compact
    ? { top: 16, right: 30, bottom: 26, left: 30 }
    : { top: 22, right: 44, bottom: 52, left: 44 };
  const iw = Math.max(10, width - pad.left - pad.right);
  const ih = height - pad.top - pad.bottom;
  const last = points.length - 1;
  const x = (i: number) => pad.left + (i / last) * iw;
  const y = (v: number) => pad.top + ih - (v / yMax) * ih;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`).join(" ");
  const area = `${line} L${x(last)},${pad.top + ih} L${x(0)},${pad.top + ih} Z`;
  const draw = inView || reduce;
  const duration = reduce ? 0 : 1.6;

  const indexFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    return clamp(Math.round(((px - pad.left) / iw) * last), 0, last);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    setHover((h) => clamp((h ?? (event.key === "ArrowRight" ? -1 : last + 1)) + (event.key === "ArrowRight" ? 1 : -1), 0, last));
  };

  const summary = `${title}. Rises from ${points[0].value} at ${points[0].label} ${xUnit} to ${points[last].value} at ${points[last].label} ${xUnit}.`;
  const tipLeft = hover !== null ? clamp(x(hover), 56, width - 56) : 0;
  const fontSize = compact ? 10 : 11;

  return (
    <div>
      <div
        ref={ref}
        className="relative w-full select-none outline-none"
        tabIndex={compact ? undefined : 0}
        onKeyDown={compact ? undefined : onKeyDown}
        onBlur={() => setHover(null)}
        aria-label={compact ? undefined : `${summary} Use the arrow keys to read each value.`}
        role={compact ? undefined : "group"}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={summary}
          className="block w-full overflow-visible"
          onPointerMove={(e) => setHover(indexFromPointer(e))}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART.accent} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Recessive hairline grid */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + iw} y1={y(t)} y2={y(t)} stroke={t === 0 ? CHART.axis : CHART.grid} strokeWidth={1} shapeRendering="crispEdges" />
              <text x={pad.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize={fontSize} fill={CHART.muted} className="mono tabular-nums">
                {t}
              </text>
            </g>
          ))}
          {points.map((p, i) => (
            <text key={p.label} x={x(i)} y={pad.top + ih + (compact ? 16 : 20)} textAnchor="middle" fontSize={fontSize} fill={hover === i ? CHART.text : CHART.muted} className="mono tabular-nums">
              {p.label}
            </text>
          ))}
          {!compact && (
            <>
              <text x={pad.left + iw / 2} y={height - 6} textAnchor="middle" fontSize={11} fill={CHART.muted} className="mono uppercase" letterSpacing="0.12em">
                {xLabel}
              </text>
              <text x={pad.left - 10} y={pad.top - 10} textAnchor="start" fontSize={11} fill={CHART.muted} className="mono uppercase" letterSpacing="0.12em">
                {yLabel}
              </text>
            </>
          )}

          <m.path
            d={area}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: draw ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.7 }}
          />
          <m.path
            d={line}
            fill="none"
            stroke={CHART.accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: draw ? 1 : 0 }}
            transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Direct labels: start and end only */}
          {!compact && (
            <m.text
              x={x(0) + 10}
              y={y(points[0].value) - 12}
              fontSize={12}
              fill={CHART.muted}
              className="mono tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: draw ? 1 : 0 }}
              transition={{ delay: reduce ? 0 : 0.4 }}
            >
              {points[0].value}
            </m.text>
          )}
          <m.g
            initial={{ opacity: 0 }}
            animate={{ opacity: draw ? 1 : 0 }}
            transition={{ delay: reduce ? 0 : duration * 0.9, duration: 0.4 }}
          >
            <circle cx={x(last)} cy={y(points[last].value)} r={4.5} fill={CHART.accent} stroke={surface} strokeWidth={2} />
            <text x={x(last) + 10} y={y(points[last].value)} dy="0.32em" fontSize={compact ? 11 : 13} fill={CHART.text} className="tabular-nums" fontWeight={500}>
              {points[last].value}
            </text>
          </m.g>

          {/* Hover crosshair */}
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + ih} stroke={CHART.axis} strokeWidth={1} />
              <circle cx={x(hover)} cy={y(points[hover].value)} r={5} fill={CHART.accentSoft} stroke={surface} strokeWidth={2} />
            </g>
          )}
          {/* Generous hit area */}
          <rect x={pad.left - 12} y={pad.top} width={iw + 24} height={ih} fill="transparent" />
        </svg>

        {hover !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border-strong bg-[#0d1630]/95 px-3 py-2 shadow-xl backdrop-blur"
            style={{ left: tipLeft, top: y(points[hover].value) - 12 }}
          >
            <div className="font-display text-[15px] font-medium text-text">{points[hover].value}</div>
            <div className="mono flex items-center gap-1.5 whitespace-nowrap text-[10.5px] text-muted">
              <span className="inline-block h-0.5 w-3 rounded bg-accent" />
              {points[hover].label} {xUnit}
            </div>
          </div>
        )}
      </div>
      <ChartTable
        caption={title}
        columns={[xLabel, yLabel]}
        rows={points.map((p) => [`${p.label} ${xUnit}`, p.value])}
        visible={showTable}
      />
    </div>
  );
}
