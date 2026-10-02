import type { Project } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";

const BLOCKS = [
  { key: "problem", label: "Problem" },
  { key: "whatIDid", label: "What I did" },
  { key: "result", label: "Result" },
] as const;

/** Overview paragraph, then Problem / What I did / Result in detail. */
export function StorySection({ project }: { project: Project }) {
  return (
    <section aria-labelledby="overview-heading" className="section-y cv relative">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader id="overview-heading" eyebrow="Overview" heading="The *short* version." />
          </div>
          <div className="lg:col-span-8 lg:pt-14">
            <Reveal>
              <p className="font-display text-[clamp(1.25rem,1.05rem+0.7vw,1.6rem)] font-light leading-[1.5] tracking-[-0.015em] text-text/90">
                <RichText text={project.detail.overview} />
              </p>
            </Reveal>
          </div>
        </div>

        <Stagger as="ol" className="mt-20 border-t border-border sm:mt-24">
          {BLOCKS.map((block, i) => (
            <StaggerItem as="li" key={block.key} className="grid gap-6 border-b border-border py-10 sm:py-12 lg:grid-cols-12 lg:gap-16">
              <div className="flex items-baseline gap-4 lg:col-span-4">
                <span className="mono text-[11px] text-accent-soft">0{i + 1}</span>
                <h2 className="title-sm">{block.label}</h2>
              </div>
              <ul className="space-y-4 lg:col-span-8">
                {project.detail[block.key].map((line) => (
                  <li key={line} className="flex gap-4 text-[16px] leading-[1.7] text-muted sm:text-[17px]">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-accent-soft/60" />
                    <span>
                      <RichText text={line} />
                    </span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
