import { cn } from "@/lib/text";

/** Table twin of a chart: screen-reader only by default, or a visible "View data" disclosure. */
export function ChartTable({
  caption,
  columns,
  rows,
  visible = false,
}: {
  caption: string;
  columns: [string, string, ...string[]];
  rows: Array<Array<string | number>>;
  visible?: boolean;
}) {
  const table = (
    <table className={cn("w-full text-left text-[13px]", !visible && "sr-only")}>
      <caption className={cn(visible ? "sr-only" : undefined)}>{caption}</caption>
      <thead>
        <tr className="border-b border-border">
          {columns.map((c) => (
            <th key={c} scope="col" className="mono py-2 pr-4 text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            {row.map((cell, j) =>
              j === 0 ? (
                <th key={j} scope="row" className="py-2 pr-4 font-normal text-text">
                  {cell}
                </th>
              ) : (
                <td key={j} className="py-2 pr-4 tabular-nums text-muted">
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (!visible) return table;
  return (
    <details className="group mt-5 border-t border-border pt-3">
      <summary className="mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent-soft">
        <span className="inline-block transition-transform duration-300 group-open:rotate-90">›</span>
        View data
      </summary>
      <div className="mt-2">{table}</div>
    </details>
  );
}
