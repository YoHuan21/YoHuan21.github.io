import { renderSiteOg } from "@/lib/og";

// Rendered once at build time to /og.png (a real .png file, so GitHub Pages serves image/png).
export const dynamic = "force-static";

export function GET() {
  return renderSiteOg();
}
