import { renderProjectOg, renderSiteOg } from "@/lib/og";
import { projects } from "@/data/content";

// Rendered at build time to /work/<slug>/og.png for each project.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return renderSiteOg();
  return renderProjectOg(project.title, `${project.type} · ${project.context}`, project.stack);
}
