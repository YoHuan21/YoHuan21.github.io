export type TextToken = { text: string; accent?: boolean; placeholder?: boolean };

const TOKEN_RE = /(\*[^*]+\*|\[PLACEHOLDER[^\]]*\])/g;

/** Splits "I turn data into *clear decisions* [PLACEHOLDER]" into styled runs. */
export function tokenize(text: string): TextToken[] {
  return text
    .split(TOKEN_RE)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("*") && part.endsWith("*")) return { text: part.slice(1, -1), accent: true };
      if (part.startsWith("[PLACEHOLDER")) return { text: part, placeholder: true };
      return { text: part };
    });
}

export type WordToken = {
  /** Styled runs that must stay together, e.g. an *accent* word plus the comma after it. */
  parts: TextToken[];
  /** Whether a space precedes this word. */
  space: boolean;
};

/**
 * Word-level tokens for staggered heading reveals. Placeholders stay whole, and
 * punctuation that directly follows an *accent* phrase stays in the same word box
 * so it can never wrap onto its own line.
 */
export function splitWords(text: string): WordToken[] {
  const words: WordToken[] = [];
  let pendingSpace = true;
  for (const token of tokenize(text)) {
    const chunks = token.placeholder ? [token.text] : token.text.split(/(\s+)/);
    for (const chunk of chunks) {
      if (!chunk) continue;
      if (/^\s+$/.test(chunk)) {
        pendingSpace = true;
        continue;
      }
      const part = { text: chunk, accent: token.accent, placeholder: token.placeholder };
      if (!pendingSpace && words.length > 0) words[words.length - 1].parts.push(part);
      else words.push({ parts: [part], space: words.length > 0 });
      pendingSpace = false;
    }
  }
  return words;
}

/** Plain text without markup, for alt text, aria-labels and metadata. */
export function plain(text: string): string {
  return text.replace(/\*([^*]+)\*/g, "$1");
}

export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes("[PLACEHOLDER");
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const numberFormat = new Intl.NumberFormat("en-US");
