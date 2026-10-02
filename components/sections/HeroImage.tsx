"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ImageEntry } from "@/lib/images";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/text";

/** Hero image with the signature cinematic treatment and a gentle parallax zoom on scroll. */
export function HeroImage({
  image,
  alt,
  sizes,
  caption,
  className,
  position,
}: {
  image: ImageEntry;
  alt: string;
  sizes: string;
  caption?: string;
  className?: string;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.2", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 48]);

  return (
    <div ref={ref} className={cn("cinematic", className)}>
      <m.div className="absolute inset-0 will-change-transform" style={reduce ? undefined : { scale, y }}>
        <div className="anim-scale-in absolute inset-0">
          <SmartImage image={image} alt={alt} sizes={sizes} priority fill position={position} />
        </div>
      </m.div>
      {caption && (
        <div className="cinematic-content absolute inset-x-0 bottom-0 flex items-center gap-3 p-5 sm:p-7">
          <span className="h-px w-8 bg-accent-soft/70" aria-hidden="true" />
          <p className="eyebrow anim-fade-up text-text/80" style={{ animationDelay: "800ms" }}>
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
