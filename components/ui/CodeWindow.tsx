import { WindowFrame } from "./WindowFrame";
import { cn } from "@/lib/text";

type Lang = "sql" | "python";
type Token = { text: string; kind?: "kw" | "fn" | "str" | "num" | "com" | "punc" };

const KEYWORDS: Record<Lang, Set<string>> = {
  sql: new Set(
    "SELECT CASE WHEN THEN ELSE END AS FROM WHERE GROUP BY ORDER BETWEEN AND OR NOT IN IS NULL JOIN ON LIMIT HAVING DISTINCT INSERT INTO CREATE TABLE".split(" "),
  ),
  python: new Set(
    "import as from def return for in if elif else lambda and or not True False None class with while try except".split(" "),
  ),
};

const PATTERN: Record<Lang, RegExp> = {
  sql: /(--[^\n]*)|('(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g,
  python: /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g,
};

function highlightLine(line: string, lang: Lang): Token[] {
  const tokens: Token[] = [];
  const re = new RegExp(PATTERN[lang].source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(line))) {
    const [text, com, str, num, word, , punc] = match;
    if (com) tokens.push({ text, kind: "com" });
    else if (str) tokens.push({ text, kind: "str" });
    else if (num) tokens.push({ text, kind: "num" });
    else if (word) {
      const next = line.slice(re.lastIndex).trimStart()[0];
      const isKw = lang === "sql" ? KEYWORDS.sql.has(word.toUpperCase()) && word === word.toUpperCase() : KEYWORDS.python.has(word);
      if (isKw && !(lang === "sql" && next === "(")) tokens.push({ text, kind: "kw" });
      else if (next === "(") tokens.push({ text, kind: "fn" });
      else tokens.push({ text });
    } else if (punc) tokens.push({ text, kind: "punc" });
    else tokens.push({ text });
  }
  return tokens;
}

/** Syntax-highlighted code card inside a window frame. */
export function CodeWindow({
  code,
  lang,
  label,
  className,
  compact = false,
}: {
  code: string;
  lang: Lang;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  const lines = code.split("\n");
  return (
    <WindowFrame label={label} className={className}>
      <div className="overflow-x-auto no-scrollbar" data-lenis-prevent>
        <pre
          className={cn("mono py-4 pr-5 text-text", compact ? "text-[11px] leading-[1.75]" : "text-[12.5px] leading-[1.8]")}
          aria-label={`${lang.toUpperCase()} code`}
        >
          <code>
            {lines.map((line, i) => (
              <span key={i} className="flex">
                <span aria-hidden="true" className="w-10 shrink-0 select-none pr-4 text-right text-[#4b5672]">
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  {highlightLine(line, lang).map((t, j) =>
                    t.kind ? (
                      <span key={j} className={`code-${t.kind}`}>
                        {t.text}
                      </span>
                    ) : (
                      t.text
                    ),
                  )}
                  {line === "" ? " " : null}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </WindowFrame>
  );
}
