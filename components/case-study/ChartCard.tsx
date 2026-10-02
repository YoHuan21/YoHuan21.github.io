import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/text";

export function ChartCard({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("h-full", className)}>
      <figure className="card glow-hover flex h-full flex-col p-6 sm:p-8">
        <figcaption>
          <p className="font-display text-[17px] tracking-[-0.015em] text-text">{title}</p>
          {note && <p className="mt-1.5 text-[14px] text-muted">{note}</p>}
        </figcaption>
        <div className="mt-8 flex-1">{children}</div>
      </figure>
    </Reveal>
  );
}
