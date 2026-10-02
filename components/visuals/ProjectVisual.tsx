import type { Project } from "@/data/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { getFolderImages } from "@/lib/images";
import { HealthcareVisual } from "./HealthcareVisual";
import { HrFlowVisual } from "./HrFlowVisual";
import { MeditapVisual } from "./MeditapVisual";
import { StudentPerformanceVisual } from "./StudentPerformanceVisual";

/** The generated visual for a project (chart, flow, diagram or mock UI). */
export function GeneratedVisual({ project, size = "card" }: { project: Project; size?: "card" | "hero" }) {
  switch (project.visual) {
    case "student-performance":
      return <StudentPerformanceVisual size={size} />;
    case "hr-analysis":
      return <HrFlowVisual />;
    case "meditap":
      return <MeditapVisual />;
    case "healthcare-system":
      return <HealthcareVisual />;
  }
}

/**
 * Home page card visual: the project's first photo in a window frame when the
 * folder has photos (and the project prefers them), otherwise the generated visual.
 */
export function ProjectCardVisual({ project }: { project: Project }) {
  const photo = project.preferPhotoOnCard ? getFolderImages(project.imagesFolder)[0] : undefined;
  if (photo) {
    return (
      <WindowFrame label={project.shortTitle}>
        <div className="relative aspect-[16/10]">
          <SmartImage
            image={photo}
            alt={`${project.shortTitle} project image`}
            sizes="(min-width: 1024px) 40vw, 90vw"
            fill
          />
        </div>
      </WindowFrame>
    );
  }
  return <GeneratedVisual project={project} />;
}
