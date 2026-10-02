import manifestJson from "@/generated/image-manifest.json";

export type ImageSource = { width: number; src: string };

export type ImageEntry = {
  key: string;
  folder: string;
  name: string;
  file: string;
  width: number;
  height: number;
  color: string;
  placeholder: string;
  sources: { avif: ImageSource[]; webp: ImageSource[] };
};

type Manifest = { generatedAt: string; widths: number[]; images: Record<string, ImageEntry> };

const manifest = manifestJson as unknown as Manifest;

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

/** Look up an image by its /assets path without extension, e.g. "photo" or "activities/wtisd-2025/cover". */
export function getImage(key: string | undefined): ImageEntry | undefined {
  if (!key) return undefined;
  return manifest.images[key] ?? manifest.images[key.toLowerCase()];
}

/** All images in an /assets folder, cover first, then in natural filename order. */
export function getFolderImages(folder: string): ImageEntry[] {
  const normalized = folder.replace(/^\/?assets\//, "").replace(/\/$/, "").toLowerCase();
  return Object.values(manifest.images)
    .filter((img) => img.folder === normalized)
    .sort((a, b) => {
      if (a.name === "cover") return -1;
      if (b.name === "cover") return 1;
      return collator.compare(a.name, b.name);
    });
}

/** The folder's cover image (cover.jpg/jpeg/png), falling back to its first image. */
export function getCover(folder: string): ImageEntry | undefined {
  return getFolderImages(folder)[0];
}

export function srcSet(sources: ImageSource[]): string {
  return sources.map((s) => `${s.src} ${s.width}w`).join(", ");
}

export function largest(sources: ImageSource[]): ImageSource {
  return sources[sources.length - 1];
}
