import { cta, site } from "@/data/content";
import { ImageReveal, Reveal, RevealHeading } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { getImage } from "@/lib/images";

export function Cta() {
  const image = getImage(cta.image);
  return (
    <section id="contact" aria-labelledby="contact-heading" className="cv relative pb-[clamp(4rem,7vw,6rem)]">
      <div className="container-x">
        <div className="cinematic flex min-h-[520px] items-center justify-center text-center sm:min-h-[620px]">
          {image && (
            <ImageReveal className="absolute inset-0" parallax={50}>
              <SmartImage
                image={image}
                alt=""
                sizes="(min-width: 1440px) 1360px, 100vw"
                fill
                position={cta.imagePosition}
                imgClassName="scale-110 blur-[4px] saturate-[0.85]"
              />
            </ImageReveal>
          )}
          {/* Dark overlay with a navy tint so the heading always reads */}
          <div aria-hidden="true" className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,7,13,0.5),rgba(10,17,40,0.78))]" />
          <div aria-hidden="true" className="glow-blue left-1/2 top-1/2 z-[1] h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 opacity-70" />

          <div className="cinematic-content px-6 py-24 sm:px-10">
            <Reveal y={12}>
              <p className="eyebrow text-text/75">{cta.eyebrow}</p>
            </Reveal>
            <RevealHeading id="contact-heading" text={cta.heading} className="display-lg mx-auto mt-5 max-w-3xl" />
            <Reveal delay={0.2}>
              <p className="body-lg mx-auto mt-5 max-w-lg text-balance text-text/75">{cta.text}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a href={`mailto:${site.email}`} className="pill pill-white">
                  <Icon name="mail" size={16} />
                  {cta.buttonLabel}
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-ghost">
                  {cta.secondaryLabel}
                  <Icon name="arrowUpRight" size={16} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
