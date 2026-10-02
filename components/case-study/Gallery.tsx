"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { ImageEntry } from "@/lib/images";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";

// The gallery code is only downloaded when someone opens it.
const Lightbox = dynamic(() => import("@/components/ui/Lightbox").then((mod) => mod.Lightbox), { ssr: false });

/** Image grid that opens a lightbox. Renders nothing for an empty folder. */
export function Gallery({ images, title }: { images: ImageEntry[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  if (images.length === 0) return null;

  const alt = (i: number) => `${title}, image ${i + 1} of ${images.length}`;

  return (
    <>
      <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <StaggerItem as="li" key={image.key}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open ${alt(i)}`}
              className="card glow-hover group relative block aspect-[4/3] w-full overflow-hidden"
            >
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                <SmartImage image={image} alt="" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" fill />
              </div>
              <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-text opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Icon name="arrowUpRight" size={16} />
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      {open !== null && (
        <Lightbox
          open
          startIndex={open}
          title={title}
          images={images.map((image, i) => ({ image, alt: alt(i) }))}
          onClose={close}
        />
      )}
    </>
  );
}
