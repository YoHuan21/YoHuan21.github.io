import { skillsSection, type SkillIcon } from "@/data/content";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/text";

// Full class names so Tailwind can see them.
const LG_SPAN: Record<number, string> = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };

const ICONS: Record<SkillIcon, IconName> = {
  code: "code",
  chart: "chart",
  database: "database",
  chip: "chip",
  globe: "globe",
  server: "server",
  tool: "tool",
};

export function Skills() {
  const groups = skillsSection.groups;
  return (
    <section id="skills" aria-labelledby="skills-heading" className="section-y cv relative">
      <div aria-hidden="true" className="glow-navy -right-60 top-1/4 h-[560px] w-[560px]" />
      <div className="container-x relative">
        <SectionHeader id="skills-heading" eyebrow={skillsSection.eyebrow} heading={skillsSection.heading} />
        <Stagger as="ul" className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {groups.map((group, i) => {
            // The last card fills the remaining columns so the grid never ends ragged.
            const isLast = i === groups.length - 1;
            const spanLg = isLast ? 4 - ((groups.length - 1) % 4) : 1;
            const spanMd = isLast && groups.length % 2 === 1 ? 2 : 1;
            return (
              <StaggerItem
                as="li"
                key={group.name}
                className={cn(spanMd === 2 && "md:col-span-2", LG_SPAN[spanLg])}
              >
                <article className="card glow-hover flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-accent-soft">
                      <Icon name={ICONS[group.icon]} size={20} />
                    </span>
                    <span className="mono text-[10.5px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-display mt-8 text-[17px] font-normal tracking-[-0.015em] text-text">{group.name}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border-strong bg-white/[0.02] px-3 py-1.5 text-[13px] leading-none text-text/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
