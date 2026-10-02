/**
 * Build-time image pipeline.
 *
 * Scans /assets (the root photo, /assets/projects/** and /assets/activities/**),
 * and for every image writes AVIF + WebP versions at 640 / 1080 / 1600 / 2400px
 * (never larger than the original), a tiny blurred placeholder, and strips all
 * EXIF / GPS metadata. Output goes to /public/images and a manifest is written to
 * /generated/image-manifest.json, which the <SmartImage> component reads.
 *
 * Runs automatically before `npm run dev` and `npm run build`. Drop new photos into
 * a folder, rebuild, and they appear on the site with no code changes.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, "assets");
const OUT_DIR = path.join(ROOT, "public", "images");
const MANIFEST_PATH = path.join(ROOT, "generated", "image-manifest.json");
const RESUME_SRC = path.join(ASSETS_DIR, "resume.pdf");
const RESUME_OUT = path.join(ROOT, "public", "resume.pdf");

const WIDTHS = [640, 1080, 1600, 2400];
// WebP uses the classic 80–85 scale. AVIF's scale is shifted: 62 is visually identical to
// WebP 82 on these photos (checked side by side) while being ~30% smaller.
const AVIF_QUALITY = 62;
const WEBP_QUALITY = 82;
const PLACEHOLDER_WIDTH = 20;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;
// Files that live in /assets but must never be published.
const EXCLUDED = new Set(["reference.png", "reference.jpg", "reference.jpeg"]);
// Bump when the encoding settings change so every image is regenerated.
const PIPELINE_VERSION = 3;

const toPosix = (p) => p.split(path.sep).join("/");

/** "My Photo (1).JPG" -> "my-photo-1" */
function slugify(segment) {
  return (
    segment
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image"
  );
}

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.name.startsWith(".")) return [];
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

function targetWidths(originalWidth) {
  const widths = WIDTHS.filter((w) => w < originalWidth);
  // Always include the original width (capped at the largest size) so no detail is lost.
  widths.push(Math.min(originalWidth, WIDTHS[WIDTHS.length - 1]));
  return [...new Set(widths)].sort((a, b) => a - b);
}

async function processImage(file, previous) {
  const rel = toPosix(path.relative(ASSETS_DIR, file));
  const parsed = path.posix.parse(rel);
  const folderSlug = parsed.dir ? parsed.dir.split("/").map(slugify).join("/") : "";
  const name = slugify(parsed.name);
  const key = folderSlug ? `${folderSlug}/${name}` : name;

  const buffer = await fs.readFile(file);
  const hash = createHash("sha1").update(buffer).update(String(PIPELINE_VERSION)).digest("hex");

  const outputsExist = (entry) =>
    entry &&
    [...entry.sources.avif, ...entry.sources.webp].every((s) =>
      existsSync(path.join(ROOT, "public", s.src)),
    );

  if (previous && previous.hash === hash && outputsExist(previous)) {
    return { key, entry: previous, cached: true };
  }

  // .rotate() bakes in EXIF orientation; sharp drops all metadata (EXIF, GPS, XMP, ICC)
  // on output because we never call .withMetadata()/.keepMetadata().
  const base = sharp(buffer, { failOn: "none" }).rotate();
  const meta = await base.metadata();
  const oriented = (meta.orientation ?? 1) >= 5;
  const width = oriented ? meta.height : meta.width;
  const height = oriented ? meta.width : meta.height;
  if (!width || !height) throw new Error(`Could not read dimensions of ${rel}`);

  if (meta.exif && meta.exif.toString("latin1").includes("GPS")) {
    console.warn(
      `  ! ${rel} contains GPS data. It is stripped from the website, but the original file\n` +
        `    would still be public if you commit /assets to a public GitHub repo.`,
    );
  }

  // Screenshots (PNG) keep full chroma so text and thin chart lines stay crisp.
  const isGraphic = /\.png$/i.test(file);
  const outDir = path.join(OUT_DIR, ...folderSlug.split("/").filter(Boolean));
  await fs.mkdir(outDir, { recursive: true });

  const sources = { avif: [], webp: [] };
  for (const w of targetWidths(width)) {
    const resized = base.clone().resize({ width: w, withoutEnlargement: true });
    const stem = `${name}-${w}`;
    const avifPath = path.join(outDir, `${stem}.avif`);
    const webpPath = path.join(outDir, `${stem}.webp`);
    await Promise.all([
      resized
        .clone()
        .avif({ quality: AVIF_QUALITY, effort: 5, chromaSubsampling: isGraphic ? "4:4:4" : "4:2:0" })
        .toFile(avifPath),
      resized
        .clone()
        .webp({ quality: WEBP_QUALITY, effort: 5, smartSubsample: true })
        .toFile(webpPath),
    ]);
    const publicBase = `/images/${folderSlug ? `${folderSlug}/` : ""}${stem}`;
    sources.avif.push({ width: w, src: `${publicBase}.avif` });
    sources.webp.push({ width: w, src: `${publicBase}.webp` });
  }

  const tiny = await base
    .clone()
    .resize({ width: PLACEHOLDER_WIDTH })
    .blur(1.2)
    .webp({ quality: 50 })
    .toBuffer();
  const { dominant } = await base.clone().resize({ width: 64 }).stats();
  const toHex = (n) => n.toString(16).padStart(2, "0");

  const entry = {
    key,
    folder: folderSlug,
    name,
    file: parsed.base,
    width,
    height,
    hash,
    color: `#${toHex(dominant.r)}${toHex(dominant.g)}${toHex(dominant.b)}`,
    placeholder: `data:image/webp;base64,${tiny.toString("base64")}`,
    sources,
  };
  return { key, entry, cached: false };
}

async function removeStaleOutputs(manifest) {
  const keep = new Set(
    Object.values(manifest).flatMap((e) =>
      [...e.sources.avif, ...e.sources.webp].map((s) => path.join(ROOT, "public", s.src)),
    ),
  );
  const existing = await walk(OUT_DIR);
  await Promise.all(existing.filter((f) => !keep.has(f)).map((f) => fs.rm(f, { force: true })));
}

async function copyResume() {
  if (!existsSync(RESUME_SRC)) {
    console.warn("  ! assets/resume.pdf not found; the Download Resume button will 404.");
    return;
  }
  await fs.mkdir(path.dirname(RESUME_OUT), { recursive: true });
  await fs.copyFile(RESUME_SRC, RESUME_OUT);
}

/** favicon.ico (16/32/48) and apple-touch-icon.png, rendered from public/icon.svg. */
async function buildIcons() {
  const svgPath = path.join(ROOT, "public", "icon.svg");
  if (!existsSync(svgPath)) return;
  const svg = await fs.readFile(svgPath, "utf8");
  const pngs = await Promise.all(
    [16, 32, 48].map((size) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer()),
  );
  // ICO container holding PNG images.
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((png, i) => {
    const size = [16, 32, 48][i];
    const entry = 6 + i * 16;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  await fs.writeFile(path.join(ROOT, "public", "favicon.ico"), Buffer.concat([header, ...pngs]));
  // iOS adds its own rounded corners, so render the apple icon full-bleed.
  const square = svg.replace(/rx="[\d.]+"/g, 'rx="0"');
  await sharp(Buffer.from(square), { density: 400 }).resize(180, 180).png().toFile(path.join(ROOT, "public", "apple-touch-icon.png"));
}

async function main() {
  const started = Date.now();
  const previous = (await readJson(MANIFEST_PATH, { images: {} })).images ?? {};

  const files = (await walk(ASSETS_DIR))
    .filter((f) => IMAGE_EXT.test(f))
    .filter((f) => !(path.dirname(f) === ASSETS_DIR && EXCLUDED.has(path.basename(f).toLowerCase())))
    .sort();

  const manifest = {};
  let generated = 0;
  // Small worker pool: sharp is already multi-threaded per image.
  const queue = [...files];
  const workers = Array.from({ length: 2 }, async () => {
    while (queue.length) {
      const file = queue.shift();
      const relKey = toPosix(path.relative(ASSETS_DIR, file));
      try {
        const { key, entry, cached } = await processImage(file, previous[keyFor(relKey)]);
        if (manifest[key]) {
          console.warn(`  ! Two files map to the same name "${key}" (${relKey}); the later one wins.`);
        }
        manifest[key] = entry;
        if (!cached) {
          generated += 1;
          console.log(`  ✓ ${relKey}  →  ${entry.sources.webp.map((s) => s.width).join(", ")}px`);
        }
      } catch (error) {
        console.error(`  ✗ ${relKey}: ${error.message}`);
      }
    }
  });
  await Promise.all(workers);

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), widths: WIDTHS, images: sorted }, null, 2),
  );
  await removeStaleOutputs(sorted);
  await copyResume();
  await buildIcons();

  const total = Object.keys(sorted).length;
  console.log(
    `Images: ${total} in manifest (${generated} generated, ${total - generated} cached) in ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}

/** Manifest key for an /assets-relative path, e.g. "activities/WTISD 2025/Cover.JPG" -> "activities/wtisd-2025/cover". */
function keyFor(rel) {
  const parsed = path.posix.parse(rel);
  const folder = parsed.dir ? parsed.dir.split("/").map(slugify).join("/") : "";
  return folder ? `${folder}/${slugify(parsed.name)}` : slugify(parsed.name);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
