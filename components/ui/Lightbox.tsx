"use client";

import { AnimatePresence, LazyMotion, m, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageEntry } from "@/lib/images";
import { lockScroll } from "@/lib/scroll";
import { cn } from "@/lib/text";
import { EASE } from "@/components/motion/Reveal";
import { Icon } from "./Icon";
import { SmartImage } from "./SmartImage";

export type LightboxImage = { image: ImageEntry; alt: string };

// Swipe needs drag gestures, which only the lightbox uses, so load them on demand.
const loadDragFeatures = () => import("@/lib/motion-features-max").then((mod) => mod.default);

/**
 * Accessible gallery built on the native <dialog>: Esc closes, arrow keys and
 * swipe navigate, focus is trapped and restored.
 */
export function Lightbox({
  images,
  open,
  startIndex = 0,
  title,
  onClose,
}: {
  images: LightboxImage[];
  open: boolean;
  startIndex?: number;
  title: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [[index, direction], setState] = useState<[number, number]>([startIndex, 0]);
  const count = images.length;

  const go = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + count) % count, delta]),
    [count],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setState([startIndex, 0]);
      dialog.showModal();
      lockScroll(true);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, startIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onDialogClose = () => {
      lockScroll(false);
      returnFocusRef.current?.focus({ preventScroll: true });
      onClose();
    };
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  // Never leave the page scroll-locked if the gallery unmounts while open.
  useEffect(() => () => lockScroll(false), []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
  };

  const current = images[index];

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} gallery`}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 text-text"
    >
      {open && current && (
        <LazyMotion features={loadDragFeatures}>
        <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}>
          <div className="container-x flex h-[var(--nav-h)] shrink-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display truncate text-[15px] text-text">{title}</p>
              <p className="mono text-[11px] text-muted" aria-live="polite">
                {index + 1} / {count}
              </p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close gallery"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong text-text transition-colors hover:text-accent-soft"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
            onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <m.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.5, ease: EASE }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={onDragEnd}
                className="cursor-grab touch-pan-y active:cursor-grabbing"
                style={{
                  width: `min(100%, calc((100dvh - 12.5rem) * ${current.image.width / current.image.height}))`,
                }}
              >
                <SmartImage
                  image={current.image}
                  alt={current.alt}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
                />
              </m.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg/60 text-text backdrop-blur transition-colors hover:text-accent-soft sm:inline-flex sm:left-6"
                >
                  <Icon name="chevronLeft" size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-bg/60 text-text backdrop-blur transition-colors hover:text-accent-soft sm:inline-flex sm:right-6"
                >
                  <Icon name="chevronRight" size={22} />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="container-x flex shrink-0 items-center justify-center gap-2 py-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text sm:hidden"
              >
                <Icon name="chevronLeft" size={20} />
              </button>
              <ul className="no-scrollbar flex max-w-full gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <li key={img.image.key}>
                    <button
                      type="button"
                      onClick={() => setState([i, i > index ? 1 : -1])}
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        "relative block h-12 w-12 overflow-hidden rounded-lg border transition-opacity duration-300",
                        i === index ? "border-accent-soft opacity-100" : "border-border opacity-50 hover:opacity-80",
                      )}
                    >
                      <SmartImage image={img.image} alt="" sizes="48px" fill />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-text sm:hidden"
              >
                <Icon name="chevronRight" size={20} />
              </button>
            </div>
          )}
        </div>
        </LazyMotion>
      )}
    </dialog>
  );
}
