"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { Activity } from "@/data/content";
import type { ImageEntry } from "@/lib/images";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn, plain } from "@/lib/text";

// The gallery code is only downloaded when someone opens it.
const Lightbox = dynamic(() => import("@/components/ui/Lightbox").then((mod) => mod.Lightbox), { ssr: false });

export type ActivityWithImages = { activity: Activity; images: ImageEntry[] };

const CARD_BG = "#080d1c";

function Meta({ activity }: { activity: Activity }) {
  return (
    <>
      <p className="mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
        <RichText text={activity.date} />
      </p>
      <h3 className="title-sm mt-2.5">{activity.title}</h3>
      <p className="mt-1.5 text-[14px] text-text/80">
        {activity.role}
        {activity.location && <span className="text-muted"> · {activity.location}</span>}
      </p>
      {activity.description && (
        <p className="body mt-3 text-[15px]">
          <RichText text={activity.description} />
        </p>
      )}
    </>
  );
}

/** Photo cards (open a lightbox gallery) followed by refined text-only cards. */
export function ActivityCards({ items }: { items: ActivityWithImages[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const close = useCallback(() => setOpenSlug(null), []);

  const withPhotos = items.filter((i) => i.images.length > 0);
  const textOnly = items.filter((i) => i.images.length === 0);
  const open = withPhotos.find((i) => i.activity.slug === openSlug);

  return (
    <>
      {withPhotos.length > 0 && (
        <Stagger as="ul" className={cn("grid gap-6", withPhotos.length > 1 && "md:grid-cols-2")}>
          {withPhotos.map(({ activity, images }) => (
            <StaggerItem as="li" key={activity.slug}>
              <article className="card glow-hover group relative h-full overflow-hidden" style={{ background: CARD_BG }}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[inherit] md:aspect-[4/3]">
                  <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                    <SmartImage
                      image={images[0]}
                      alt=""
                      sizes="(min-width: 768px) 45vw, calc(100vw - 2rem)"
                      fill
                      position={activity.coverPosition ?? "50% 35%"}
                    />
                  </div>
                  {/* Vignette + bottom fade into the card */}
                  <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,transparent_55%,rgba(5,7,13,0.55)_100%)]" />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[45%]" style={{ background: `linear-gradient(to bottom, transparent, ${CARD_BG}cc 60%, ${CARD_BG})` }} />
                  <span className="mono absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10.5px] text-text backdrop-blur-md">
                    <Icon name="images" size={14} />
                    {images.length} photo{images.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="relative -mt-20 p-6 sm:p-8">
                  <Meta activity={activity} />
                  <span aria-hidden="true" className="link-arrow mt-4 min-h-0 text-[14px]">
                    View gallery
                    <Icon name="arrowRight" size={16} className="arrow" />
                  </span>
                </div>
                {/* Whole-card hit area */}
                <button
                  type="button"
                  onClick={() => setOpenSlug(activity.slug)}
                  aria-label={`Open gallery: ${plain(activity.title)}, ${images.length} photo${images.length === 1 ? "" : "s"}`}
                  className="absolute inset-0 z-10 rounded-[inherit]"
                />
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {textOnly.length > 0 && (
        <Stagger
          as="ul"
          className={cn(
            "mt-6 grid gap-6",
            textOnly.length === 2 && "md:grid-cols-2",
            textOnly.length >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {textOnly.map(({ activity }) => (
            <StaggerItem as="li" key={activity.slug}>
              <article className="card glow-hover flex h-full flex-col p-6 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-white/[0.02] text-accent-soft">
                  <Icon name={activity.icon} size={20} />
                </span>
                <div className="mt-6">
                  <Meta activity={activity} />
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {open && (
        <Lightbox
          open
          title={plain(open.activity.title)}
          images={open.images.map((image, i) => ({
            image,
            alt: `${plain(open.activity.title)}, photo ${i + 1} of ${open.images.length}`,
          }))}
          onClose={close}
        />
      )}
    </>
  );
}
