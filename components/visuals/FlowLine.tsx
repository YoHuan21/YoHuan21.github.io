import type { CSSProperties } from "react";
import { cn } from "@/lib/text";

/** A hairline connector with glowing data packets travelling along it (transform + opacity only). */
export function FlowLine({
  orientation,
  direction = "forward",
  duration = 2.6,
  delay = 0,
  className,
}: {
  orientation: "horizontal" | "vertical";
  direction?: "forward" | "backward" | "both";
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const horizontal = orientation === "horizontal";
  const packet = (reverse: boolean, offset: number) => {
    const style: CSSProperties = {
      animation: `${horizontal ? "sweep-x" : "sweep-y"}${reverse ? "-rev" : ""} ${duration}s cubic-bezier(0.45,0,0.55,1) ${delay + offset}s infinite both`,
    };
    return (
      <span aria-hidden="true" className="absolute inset-0 will-change-transform" style={style}>
        <span
          className={cn(
            "absolute h-1.5 w-1.5 rounded-full bg-accent-soft shadow-[0_0_10px_2px_rgba(59,130,246,0.85)]",
            horizontal ? "top-1/2 -translate-y-1/2" : "left-1/2 -translate-x-1/2",
            horizontal ? (reverse ? "left-0" : "right-0") : reverse ? "top-0" : "bottom-0",
          )}
        />
      </span>
    );
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative",
        horizontal ? "h-px w-full bg-gradient-to-r" : "h-full w-px bg-gradient-to-b",
        "from-[rgba(147,197,253,0.08)] via-[rgba(147,197,253,0.35)] to-[rgba(147,197,253,0.08)]",
        className,
      )}
    >
      {(direction === "forward" || direction === "both") && packet(false, 0)}
      {(direction === "backward" || direction === "both") && packet(true, duration / 2)}
    </div>
  );
}
