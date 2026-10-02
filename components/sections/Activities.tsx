import { activities, activitiesSection } from "@/data/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFolderImages } from "@/lib/images";
import { ActivityCards } from "./ActivityCards";

export function Activities() {
  // Folders without photos render as text cards and switch to photo cards after a rebuild.
  const items = activities.map((activity) => ({ activity, images: getFolderImages(activity.folder) }));
  const hasPhotos = items.some((i) => i.images.length > 0);

  return (
    <section id="activities" aria-labelledby="activities-heading" className="section-y cv relative">
      <div className="container-x">
        <SectionHeader
          id="activities-heading"
          eyebrow={activitiesSection.eyebrow}
          heading={activitiesSection.heading}
          intro={hasPhotos ? activitiesSection.intro : undefined}
        />
        <div className="mt-14 sm:mt-16">
          <ActivityCards items={items} />
        </div>
      </div>
    </section>
  );
}
