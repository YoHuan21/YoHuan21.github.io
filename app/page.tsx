import { About } from "@/components/sections/About";
import { Activities } from "@/components/sections/Activities";
import { Cta } from "@/components/sections/Cta";
import { Education } from "@/components/sections/Education";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Skills } from "@/components/sections/Skills";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { site } from "@/data/content";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  alternateName: site.name,
  jobTitle: "Aspiring Junior Data Analyst",
  description: site.description,
  url: site.url,
  sameAs: [site.github, site.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: site.university },
  knowsAbout: ["Data analysis", "SQL", "Python", "Power BI", "Apache Hadoop", "Apache Hive", "IoT"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <SkillsMarquee />
      <SelectedWork />
      <About />
      <Activities />
      <Education />
      <Skills />
      <Cta />
    </>
  );
}
