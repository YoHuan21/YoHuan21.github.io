"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Tracks an element's rendered width so SVG charts draw at real pixel size (crisp text at any width). */
export function useElementWidth<T extends HTMLElement>(fallback = 520) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = (w: number) => setWidth((prev) => (Math.abs(prev - w) > 0.5 ? Math.round(w) : prev));
    update(el.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

/** A DOM-safe unique id for SVG gradient references. */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

export const CHART = {
  accent: "#3b82f6",
  accentSoft: "#93c5fd",
  grid: "rgba(148, 163, 184, 0.12)",
  axis: "rgba(148, 163, 184, 0.24)",
  text: "#e8ecf4",
  muted: "#8b94a9",
  surface: "#0b1328",
  /** Ordinal ramp for grades A→F, validated on the navy surface (monotone lightness, ΔL ≥ 0.06). */
  ordinal: ["#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1e40af"],
} as const;

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
