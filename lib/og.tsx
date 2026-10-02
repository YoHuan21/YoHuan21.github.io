import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const OG_SIZE = { width: 1200, height: 630 };

/** Fetches a TTF from Google Fonts at build time; falls back to the default font if offline. */
async function loadGoogleFont(query: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${query}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

async function fonts() {
  const [light, medium, serif] = await Promise.all([
    loadGoogleFont("Manrope:wght@300"),
    loadGoogleFont("Manrope:wght@500"),
    loadGoogleFont("Instrument+Serif:ital@1"),
  ]);
  const list: Array<{ name: string; data: ArrayBuffer; weight: 300 | 500 | 400; style: "normal" | "italic" }> = [];
  if (light) list.push({ name: "Manrope", data: light, weight: 300, style: "normal" });
  if (medium) list.push({ name: "Manrope", data: medium, weight: 500, style: "normal" });
  if (serif) list.push({ name: "Instrument Serif", data: serif, weight: 400, style: "italic" });
  return list;
}

function Monogram() {
  return (
    <div
      style={{
        display: "flex",
        width: 56,
        height: 56,
        borderRadius: 14,
        border: "1px solid rgba(147,197,253,0.25)",
        background: "linear-gradient(135deg, #0F1B3D, #05070D)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.6">
        <path d="M17 46V18h14M17 31.5h11" stroke="#E8ECF4" />
        <path d="M45 18v19.5a8.5 8.5 0 0 1-8.5 8.5H35" stroke="#3B82F6" />
      </svg>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#05070D",
        backgroundImage: "radial-gradient(circle at 80% 12%, rgba(37,99,235,0.34) 0%, rgba(15,27,61,0.28) 32%, rgba(5,7,13,0) 62%)",
        color: "#E8ECF4",
        fontFamily: "Manrope",
      }}
    >
      {children}
    </div>
  );
}

/** Site-wide social card: name, title and portrait. */
export async function renderSiteOg() {
  let photo: string | null = null;
  try {
    // Satori re-renders the pixels to PNG, so no metadata from the original survives.
    const buf = await readFile(join(process.cwd(), "assets", "photo.jpeg"));
    photo = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    photo = null;
  }

  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Monogram />
            <div style={{ display: "flex", fontSize: 18, letterSpacing: "0.2em", color: "#8B94A9", fontWeight: 500 }}>PORTFOLIO</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1 }}>{site.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", marginTop: 22, fontSize: 40, fontWeight: 300, letterSpacing: "-0.02em", color: "#E8ECF4" }}>
              Turning data into&nbsp;
              <span style={{ fontFamily: "Instrument Serif", fontStyle: "italic", color: "#93C5FD", fontSize: 46 }}>clear decisions</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: "#8B94A9", fontWeight: 500, whiteSpace: "nowrap" }}>
            <span>Final-year IT student at UiTM</span>
            <span style={{ width: 5, height: 5, borderRadius: 9999, background: "#3B82F6", flexShrink: 0 }} />
            <span>Aspiring Junior Data Analyst</span>
          </div>
        </div>
        {photo && (
          <div style={{ display: "flex", position: "relative", width: 390, height: 520, margin: "55px 64px 55px 0", borderRadius: 28, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} width={390} height={520} alt="" style={{ objectFit: "cover" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 220,
                background: "linear-gradient(to bottom, rgba(5,7,13,0), rgba(5,7,13,0.85) 75%, #05070D)",
              }}
            />
          </div>
        )}
      </Frame>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

/** Per-project social card. */
export async function renderProjectOg(title: string, meta: string, stack: string[]) {
  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Monogram />
            <div style={{ display: "flex", fontSize: 18, letterSpacing: "0.2em", color: "#8B94A9", fontWeight: 500 }}>CASE STUDY</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 960 }}>{title}</div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 22, letterSpacing: "0.12em", color: "#8B94A9", fontWeight: 500 }}>
              {meta.toUpperCase()}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {stack.slice(0, 5).map((s) => (
                <div
                  key={s}
                  style={{ display: "flex", padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(148,163,184,0.25)", fontSize: 20, color: "#E8ECF4" }}
                >
                  {s}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#93C5FD", fontWeight: 500 }}>{site.name}</div>
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
