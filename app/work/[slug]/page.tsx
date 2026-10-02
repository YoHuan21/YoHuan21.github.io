import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { Gallery } from "@/components/case-study/Gallery";
import { NextProject } from "@/components/case-study/NextProject";
import { ProjectData } from "@/components/case-study/ProjectData";
import { StorySection } from "@/components/case-study/StorySection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects, site } from "@/data/content";
import { getFolderImages } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const url = `/work/${project.slug}/`;
  const image = { url: `/work/${project.slug}/og.png`, width: 1200, height: 630, alt: project.title };
  return {
    title: project.title,
    description: project.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: `${site.name} Portfolio`,
      title: `${project.title} · ${site.name}`,
      description: project.seoDescription,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: project.title, description: project.seoDescription, images: [image.url] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const gallery = getFolderImages(project.imagesFolder);

  return (
    <article>
      <CaseStudyHero project={project} />
      <StorySection project={project} />
      <ProjectData project={project} />
      {gallery.length > 0 && (
        <section aria-labelledby="gallery-heading" className="section-y cv relative pt-0 sm:pt-0">
          <div className="container-x">
            <SectionHeader id="gallery-heading" eyebrow="Gallery" heading={project.galleryTitle} intro={project.galleryCaption} />
            <div className="mt-12">
              <Gallery images={gallery} title={`${project.shortTitle}: ${project.galleryTitle}`} />
            </div>
          </div>
        </section>
      )}
      <NextProject project={next} />
    </article>
  );
}
