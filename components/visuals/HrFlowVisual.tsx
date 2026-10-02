import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { cn } from "@/lib/text";
import { FlowLine } from "./FlowLine";

function Node({
  icon,
  eyebrow,
  title,
  children,
  highlight = false,
  className,
}: {
  icon: IconName;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border px-3.5 py-3",
        highlight
          ? "border-[rgba(147,197,253,0.35)] bg-[rgba(59,130,246,0.12)] shadow-[0_0_40px_-12px_rgba(59,130,246,0.6)]"
          : "border-border-strong bg-white/[0.025]",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className={cn("mt-0.5 shrink-0", highlight ? "text-accent-soft" : "text-muted")}>
          <Icon name={icon} size={16} />
        </span>
        <div className="min-w-0">
          {eyebrow && <p className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted">{eyebrow}</p>}
          <p className="font-display text-[13px] leading-snug text-text">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Two datasets → merge & clean → analyze attrition → dashboard. */
export function HrFlowVisual() {
  return (
    <WindowFrame label="attrition_analysis · pipeline" bodyClassName="p-5 md:p-6">
      <div className="grid grid-cols-2 gap-3">
        <Node icon="table" eyebrow="Dataset 01" title="IBM HR Analytics">
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted">Employee Attrition &amp; Performance</p>
        </Node>
        <Node icon="table" eyebrow="Dataset 02" title="Productivity & Satisfaction">
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted">Employee HR Data</p>
        </Node>
      </div>

      {/* Two streams merging */}
      <svg viewBox="0 0 200 36" preserveAspectRatio="none" className="h-9 w-full" aria-hidden="true">
        <path d="M50 0 C50 22, 100 14, 100 36" fill="none" stroke="rgba(147,197,253,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M150 0 C150 22, 100 14, 100 36" fill="none" stroke="rgba(147,197,253,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="mx-auto max-w-[260px]">
        <Node icon="filter" title="Merge & clean" />
      </div>
      <div className="mx-auto h-7 w-px">
        <FlowLine orientation="vertical" duration={2.2} />
      </div>
      <Node icon="chart" title="Analyze attrition" className="mx-auto max-w-[360px]">
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Factors analyzed">
          {["Department", "Job role", "Age", "Overtime"].map((f) => (
            <li key={f} className="mono rounded-full border border-border-strong px-2 py-0.5 text-[10px] text-muted">
              {f}
            </li>
          ))}
        </ul>
      </Node>
      <div className="mx-auto h-7 w-px">
        <FlowLine orientation="vertical" duration={2.2} delay={1.1} />
      </div>
      <div className="mx-auto max-w-[260px]">
        <Node icon="layers" title="Dashboard" highlight>
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted">Retention insights for HR teams</p>
        </Node>
      </div>
    </WindowFrame>
  );
}
