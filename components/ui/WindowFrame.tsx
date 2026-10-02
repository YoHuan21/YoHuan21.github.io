import type { ReactNode } from "react";
import { cn } from "@/lib/text";

/** Mock application window (like the reference's dashboard and code cards). */
export function WindowFrame({
  label,
  children,
  footer,
  className,
  bodyClassName,
  addressBar,
}: {
  label?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Renders a browser-style address pill instead of the label. */
  addressBar?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-border-strong bg-[#0b1328]/95 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.02)_inset]",
        className,
      )}
    >
      <div className="flex items-center gap-4 border-b border-border px-4 py-3">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        {addressBar ? (
          <div className="min-w-0 flex-1">{addressBar}</div>
        ) : (
          label && (
            <span className="mono ml-auto truncate text-[10.5px] uppercase tracking-[0.18em] text-muted">{label}</span>
          )
        )}
      </div>
      <div className={bodyClassName}>{children}</div>
      {footer && (
        <div className="mono flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 text-[10.5px] text-muted">
          {footer}
        </div>
      )}
    </div>
  );
}
