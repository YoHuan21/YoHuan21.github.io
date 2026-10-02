import { Reveal, RevealHeading } from "@/components/motion/Reveal";
import { RichText } from "./RichText";
import { cn } from "@/lib/text";

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  id,
  className,
  align = "left",
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  id?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal y={12}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <RevealHeading text={heading} id={id} className="display-lg mt-5" />
      {intro && (
        <Reveal delay={0.15}>
          <p className="body-lg mt-6 max-w-2xl">
            <RichText text={intro} />
          </p>
        </Reveal>
      )}
    </div>
  );
}
