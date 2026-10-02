import { Fragment } from "react";
import { tokenize } from "@/lib/text";

/** Renders *accent* words in italic serif and [PLACEHOLDER] text with a visible marker. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {tokenize(text).map((token, i) => {
        if (token.accent)
          return (
            <em key={i} className="accent">
              {token.text}
            </em>
          );
        if (token.placeholder)
          return (
            <mark key={i} className="placeholder-mark">
              {token.text}
            </mark>
          );
        return <Fragment key={i}>{token.text}</Fragment>;
      })}
    </>
  );
}
