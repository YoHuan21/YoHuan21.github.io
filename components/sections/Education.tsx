import { education } from "@/data/content";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="section-y cv relative pt-0 sm:pt-0">
      <div className="container-x">
        <div className="hairline-x mb-[clamp(4rem,8vw,7rem)]" aria-hidden="true" />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader id="education-heading" eyebrow={education.eyebrow} heading={education.heading} />
          </div>
          <div className="lg:col-span-8">
            {education.items.map((item) => (
              <Reveal key={item.degree}>
                <article className="card glow-hover overflow-hidden p-7 sm:p-10">
                  <div aria-hidden="true" className="glow-blue -right-32 -top-32 h-80 w-80 opacity-60" />
                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white/[0.02] text-accent-soft">
                        <Icon name="graduation" size={22} />
                      </span>
                      <div>
                        <h3 className="display-md max-w-[22ch]">{item.degree}</h3>
                        <p className="mt-2 text-[15px] text-text/80">{item.school}</p>
                      </div>
                    </div>
                    <p className="mono shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted sm:pt-2">{item.dates}</p>
                  </div>
                  <ul className="relative mt-8 flex flex-wrap gap-2.5" aria-label="Awards">
                    {item.highlights.map((h) => (
                      <li
                        key={h}
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(147,197,253,0.28)] bg-[rgba(59,130,246,0.08)] px-4 py-2 text-[13.5px] text-text"
                      >
                        <Icon name="award" size={15} className="text-accent-soft" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <ul className="relative mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5" aria-label="Details">
                    {item.details.map((d) => (
                      <li key={d} className="mono text-[12px] text-muted">
                        {d}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
