/**
 * Post-build fix for the static export (runs automatically after `npm run build`).
 *
 * Next.js writes some route-segment prefetch files into nested folders, e.g.
 *   out/work/meditap/__next.work/$d$slug/__PAGE__.txt
 * but the browser requests them by a flat, dot-joined name:
 *   out/work/meditap/__next.work.$d$slug.__PAGE__.txt
 * GitHub Pages has no rewrites, so we add a flat copy next to each nested file.
 * Without this, link prefetches 404 (pages still work, they just load slower).
 */
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return e.name === "_next" ? [] : walk(full);
      return [full];
    }),
  );
  return nested.flat();
}

async function main() {
  if (!existsSync(OUT)) return;
  let copied = 0;
  for (const file of await walk(OUT)) {
    const rel = path.relative(OUT, file).split(path.sep);
    // Find the first "__next.*" folder in the path and flatten everything after it.
    const i = rel.findIndex((part, idx) => part.startsWith("__next.") && idx < rel.length - 1);
    if (i === -1) continue;
    const flatName = rel.slice(i).join(".");
    const target = path.join(OUT, ...rel.slice(0, i), flatName);
    if (!existsSync(target)) {
      await fs.copyFile(file, target);
      copied += 1;
    }
  }
  console.log(`Export fix: added ${copied} flat prefetch file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
