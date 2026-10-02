"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { largest, srcSet, type ImageEntry } from "@/lib/images";
import { cn } from "@/lib/text";

type Props = {
  image: ImageEntry;
  alt: string;
  /** The `sizes` attribute, e.g. "(min-width: 1024px) 40vw, 100vw". */
  sizes: string;
  /** Above-the-fold images: eager, high fetch priority, no fade. Pair with a preload. */
  priority?: boolean;
  /** Fill the nearest positioned parent instead of keeping the natural aspect ratio. */
  fill?: boolean;
  className?: string;
  imgClassName?: string;
  /** CSS object-position, e.g. "50% 20%". */
  position?: string;
  style?: CSSProperties;
};

/**
 * <picture> with AVIF + WebP srcsets from the build-time pipeline, explicit
 * dimensions (no layout shift), lazy loading and a blurred placeholder that
 * fades away once the real image has loaded.
 */
export function SmartImage({
  image,
  alt,
  sizes,
  priority = false,
  fill = false,
  className,
  imgClassName,
  position,
  style,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    const img = imgRef.current;
    // The image may have finished loading before React hydrated.
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const id = window.setTimeout(() => setShowPlaceholder(false), 900);
    return () => window.clearTimeout(id);
  }, [loaded]);

  const fallback = largest(image.sources.webp);
  const visible = priority || loaded;

  return (
    <div
      className={cn(fill ? "absolute inset-0" : "relative", "overflow-hidden", className)}
      style={{
        backgroundColor: "#0a1128",
        aspectRatio: fill ? undefined : `${image.width} / ${image.height}`,
        ...style,
      }}
    >
      {showPlaceholder && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 scale-110 bg-cover blur-2xl transition-opacity duration-700",
            loaded ? "opacity-0" : "opacity-100",
          )}
          style={{ backgroundImage: `url(${image.placeholder})`, backgroundPosition: position ?? "center" }}
        />
      )}
      <picture>
        <source type="image/avif" srcSet={srcSet(image.sources.avif)} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(image.sources.webp)} sizes={sizes} />
        <img
          ref={imgRef}
          src={fallback.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            !priority && "transition-opacity duration-700 ease-out",
            visible ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          style={{ objectPosition: position }}
        />
      </picture>
    </div>
  );
}
