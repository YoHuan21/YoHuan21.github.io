import { Fragment } from "react";
import { splitWords } from "@/lib/text";
import { WordParts } from "./WordParts";

/**
 * Above-the-fold heading revealed word by word with pure CSS animations,
 * so it paints immediately without waiting for JavaScript (good for LCP).
 */
export function SplitHeading({
  text,
  as: As = "h1",
  className,
  delay = 60,
  stagger = 30,
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = splitWords(text);
  return (
    <As className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {word.space && " "}
          <span className="word-mask">
            <span className="anim-rise" style={{ animationDelay: `${delay + i * stagger}ms` }}>
              <WordParts parts={word.parts} />
            </span>
          </span>
        </Fragment>
      ))}
    </As>
  );
}
