import { projects, work } from "@/data/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCardVisual } from "@/components/visuals/ProjectVisual";
import { ProjectCard } from "./ProjectCard";

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="section-y cv relative">
      <div className="container-x">
        <SectionHeader id="work-heading" eyebrow={work.eyebrow} heading={work.heading} intro={work.intro} />
        <div className="mt-14 flex flex-col gap-8 sm:mt-20 sm:gap-12">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              index={i}
              project={{
                slug: project.slug,
                title: project.title,
                shortTitle: project.shortTitle,
                icon: project.icon,
                type: project.type,
                context: project.context,
                story: project.story,
              }}
              visual={<ProjectCardVisual project={project} />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
