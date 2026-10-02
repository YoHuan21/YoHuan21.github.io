import Link from "next/link";
import type { Project } from "@/data/content";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

export function NextProject({ project }: { project: Project }) {
  return (
    <section aria-label="Next project" className="cv relative pb-[clamp(4rem,7vw,6rem)]">
      <div className="container-x">
        <Reveal>
          <Link
            href={`/work/${project.slug}/`}
            className="card glow-hover group relative flex flex-col gap-8 overflow-hidden p-8 sm:flex-row sm:items-end sm:justify-between sm:p-12"
          >
            <div aria-hidden="true" className="glow-blue -right-20 -top-40 h-[420px] w-[420px] opacity-70" />
            <div className="relative">
              <p className="eyebrow">Next project</p>
              <p className="display-md mt-4 max-w-2xl transition-colors duration-500 group-hover:text-accent-soft">{project.title}</p>
              <p className="mono mt-4 text-[11px] uppercase tracking-[0.16em] text-muted">
                {project.type} · {project.context}
              </p>
            </div>
            <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-text text-bg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
              <Icon name="arrowRight" size={22} />
              <span className="sr-only">Next project →</span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
