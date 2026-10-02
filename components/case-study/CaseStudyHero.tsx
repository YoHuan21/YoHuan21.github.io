import { preload } from "react-dom";
import type { Project } from "@/data/content";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { HeroImage } from "@/components/sections/HeroImage";
import { GeneratedVisual } from "@/components/visuals/ProjectVisual";
import { getFolderImages, getImage, srcSet, type ImageEntry } from "@/lib/images";

function Meta({ project }: { project: Project }) {
  const rows = [
    { label: "Role", value: project.role },
    { label: "Type", value: project.type },
    { label: "Context", value: project.context },
  ];
  return (
    <dl className="anim-fade-up mt-10 grid gap-x-10 gap-y-6 border-t border-border pt-8 sm:grid-cols-3" style={{ animationDelay: "700ms" }}>
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="eyebrow">{row.label}</dt>
          <dd className="mt-2 text-[15px] leading-relaxed text-text">
            <RichText text={row.value} />
          </dd>
        </div>
      ))}
      <div className="sm:col-span-3">
        <dt className="eyebrow">Tech stack</dt>
        <dd className="mt-3">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="mono rounded-full border border-border-strong bg-white/[0.02] px-3 py-1.5 text-[12px] text-text/85">
                {s}
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}

/** Case study top: title, summary, meta and a hero visual with the signature treatment. */
export function CaseStudyHero({ project }: { project: Project }) {
  const heroPhoto: ImageEntry | undefined =
    getImage(project.heroImage?.key) ?? (project.preferPhotoOnCard ? getFolderImages(project.imagesFolder)[0] : undefined);
  const portrait = heroPhoto ? heroPhoto.height > heroPhoto.width : false;
  const sizes = portrait
    ? "(min-width: 1440px) 540px, (min-width: 1024px) 38vw, calc(100vw - 2rem)"
    : "(min-width: 1440px) 1360px, calc(100vw - 2rem)";

  if (heroPhoto) {
    preload(heroPhoto.sources.avif[0].src, {
      as: "image",
      type: "image/avif",
      imageSrcSet: srcSet(heroPhoto.sources.avif),
      imageSizes: sizes,
    });
  }

  const intro = (
    <>
      <AnchorLink
        href="/#work"
        className="font-display anim-fade-up inline-flex min-h-11 items-center gap-2 text-[14px] text-muted transition-colors hover:text-accent-soft"
      >
        <Icon name="arrowLeft" size={16} />
        All work
      </AnchorLink>
      <p className="eyebrow anim-fade-up mt-8" style={{ animationDelay: "60ms" }}>
        Case study · {project.type}
      </p>
      <SplitHeading text={project.title} className="display-lg mt-5 max-w-4xl" />
      <p className="body-lg anim-fade-up mt-7 max-w-2xl" style={{ animationDelay: "550ms" }}>
        {project.summary}
      </p>
      <Meta project={project} />
    </>
  );

  return (
    <section aria-label="Project overview" className="relative overflow-hidden pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
      <div aria-hidden="true" className="glow-navy -right-40 -top-40 h-[720px] w-[720px]" />
      <div className="container-x relative">
        {heroPhoto && portrait ? (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:self-end">{intro}</div>
            <div className="lg:col-span-5">
              <HeroImage
                image={heroPhoto}
                alt={project.heroImage?.alt ?? project.title}
                caption={project.heroImage?.caption}
                sizes={sizes}
                position="62% 45%"
                className="mx-auto aspect-[4/5] w-full max-w-[560px] lg:max-w-none"
              />
            </div>
          </div>
        ) : (
          <>
            {intro}
            {heroPhoto ? (
              <HeroImage
                image={heroPhoto}
                alt={project.heroImage?.alt ?? project.title}
                caption={project.heroImage?.caption}
                sizes={sizes}
                className="mt-14 aspect-[16/10] sm:aspect-[21/9]"
              />
            ) : (
              <div className="cinematic anim-fade-up mt-14 bg-[#060a16] sm:mt-16" style={{ animationDelay: "500ms" }}>
                <div aria-hidden="true" className="glow-blue left-1/2 top-1/2 h-[130%] w-[90%] -translate-x-1/2 -translate-y-1/2" />
                <div aria-hidden="true" className="rays" />
                <div className="relative mx-auto max-w-[920px] px-4 pt-10 sm:px-10 sm:pt-16">
                  <GeneratedVisual project={project} size="hero" />
                  <div className="h-10 sm:h-16" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
