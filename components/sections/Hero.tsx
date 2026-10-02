import { Fragment } from "react";
import { preload } from "react-dom";
import { hero } from "@/data/content";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Icon } from "@/components/ui/Icon";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { getImage, srcSet } from "@/lib/images";
import { HeroImage } from "./HeroImage";

export function Hero() {
  const image = getImage(hero.image);
  // Portrait photo → split hero (headline left, portrait right). Landscape → wide banner.
  const wide = image ? image.width / image.height >= 1.25 : false;
  const sizes = wide
    ? "(min-width: 1440px) 1360px, calc(100vw - 2rem)"
    : "(min-width: 1440px) 540px, (min-width: 1024px) 38vw, calc(100vw - 2rem)";

  if (image) {
    preload(image.sources.avif[0].src, {
      as: "image",
      type: "image/avif",
      imageSrcSet: srcSet(image.sources.avif),
      imageSizes: sizes,
    });
  }

  const intro = (
    <p className="body-lg anim-fade-up max-w-xl" style={{ animationDelay: "600ms" }}>
      {hero.intro}
    </p>
  );

  const ctas = (
    <div className="anim-fade-up mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "520ms" }}>
      <AnchorLink href={hero.primaryCta.href} className="pill pill-white">
        {hero.primaryCta.label}
        <Icon name="arrowRight" size={16} />
      </AnchorLink>
      <AnchorLink href={hero.secondaryCta.href} className="pill pill-ghost">
        {hero.secondaryCta.label}
      </AnchorLink>
    </div>
  );

  const heading = (
    <>
      <p className="eyebrow anim-fade-up" style={{ animationDelay: "50ms" }}>
        {hero.eyebrow}
      </p>
      <div className="mt-6">
        <SplitHeading text={hero.headline} className="display-hero" />
      </div>
      <p
        className="font-display anim-fade-up mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] tracking-[-0.005em] text-text/85 sm:text-base"
        style={{ animationDelay: "420ms" }}
      >
        {hero.subline.split("·").map((part, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />}
            <span>{part.trim()}</span>
          </Fragment>
        ))}
      </p>
    </>
  );

  return (
    <section aria-label="Introduction" className="relative overflow-hidden pt-[calc(var(--nav-h)+2.5rem)] sm:pt-[calc(var(--nav-h)+4rem)]">
      <div aria-hidden="true" className="glow-navy -right-40 -top-40 h-[720px] w-[720px]" />
      <div aria-hidden="true" className="glow-blue right-[8%] top-[30%] h-[520px] w-[520px] opacity-70" />

      <div className="container-x relative">
        {wide || !image ? (
          <>
            <div className="max-w-5xl">
              {heading}
              {ctas}
            </div>
            {image && (
              <HeroImage
                image={image}
                alt={hero.imageAlt}
                sizes={sizes}
                caption={hero.imageCaption}
                className="mt-14 aspect-[16/10] sm:aspect-[21/9]"
              />
            )}
            <div className="mt-10">{intro}</div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:self-end">
              {heading}
              {ctas}
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
              <HeroImage
                image={image}
                alt={hero.imageAlt}
                sizes={sizes}
                caption={hero.imageCaption}
                position="64% 38%"
                className="mx-auto aspect-[4/5] w-full max-w-[560px] lg:max-w-none"
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-end lg:pb-4">
              <div className="hairline-x mb-8 max-w-xl" aria-hidden="true" />
              {intro}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
