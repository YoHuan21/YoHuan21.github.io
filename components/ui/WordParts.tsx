import type { TextToken } from "@/lib/text";

/** The styled runs inside one animated word box (accent serif, placeholder mark, or plain). */
export function WordParts({ parts }: { parts: TextToken[] }) {
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={part.accent ? "accent" : part.placeholder ? "placeholder-mark" : undefined}>
          {part.text}
        </span>
      ))}
    </>
  );
}
