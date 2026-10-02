import { about } from "@/data/content";
import { CountUp, ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SmartImage } from "@/components/ui/SmartImage";
import { getImage } from "@/lib/images";

export function About() {
  const image = getImage(about.image);
  return (
    <section id="about" aria-labelledby="about-heading" className="section-y cv relative">
      <div aria-hidden="true" className="glow-navy -left-60 top-10 h-[700px] w-[700px]" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-24">
        {image && (
          <div className="lg:col-span-5">
            <ImageReveal className="cinematic mx-auto aspect-[4/5] w-full max-w-[520px]" parallax={28}>
              {/* A tighter crop than the hero, so the two uses of the photo feel distinct. */}
              <SmartImage
                image={image}
                alt={about.imageAlt}
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 520px, calc(100vw - 2rem)"
                fill
                position="70% 36%"
                imgClassName="scale-[1.28] origin-[72%_36%]"
              />
            </ImageReveal>
          </div>
        )}
        <div className="lg:col-span-7">
          <SectionHeader id="about-heading" eyebrow={about.eyebrow} heading={about.heading} />
          <div className="mt-8 max-w-2xl space-y-5">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="body-lg">
                  <RichText text={p} />
                </p>
              </Reveal>
            ))}
          </div>
          <Stagger as="ul" className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8" delay={0.1}>
            {about.stats.map((stat) => (
              <StaggerItem as="li" key={stat.label} className="border-t border-border-strong pt-5">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="font-display block text-[2.5rem] font-light leading-none tracking-[-0.035em] text-text sm:text-[2.75rem]"
                />
                <span className="mt-3 block text-[14px] text-muted">{stat.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
