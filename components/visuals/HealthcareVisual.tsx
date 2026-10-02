import { Icon, type IconName } from "@/components/ui/Icon";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { cn } from "@/lib/text";

const modules: Array<{ label: string; icon: IconName; active?: boolean }> = [
  { label: "Equipment", icon: "layers", active: true },
  { label: "Maintenance", icon: "tool" },
  { label: "Reservations", icon: "clock" },
  { label: "Account", icon: "users" },
];

const statuses = {
  available: { label: "Available", dot: "bg-[#0ca30c]" },
  maintenance: { label: "In maintenance", dot: "bg-[#fab219]" },
  reserved: { label: "Reserved", dot: "bg-accent-soft" },
} as const;

// Skeleton rows: no invented equipment names or numbers.
const rows: Array<{ name: number; status: keyof typeof statuses; date: number }> = [
  { name: 62, status: "available", date: 44 },
  { name: 48, status: "maintenance", date: 52 },
  { name: 70, status: "reserved", date: 40 },
  { name: 54, status: "available", date: 48 },
  { name: 40, status: "available", date: 56 },
];

/** Mock browser window with a clean dashboard-style UI for the Java web app. */
export function HealthcareVisual() {
  return (
    <WindowFrame
      addressBar={
        <div className="mono flex min-w-0 items-center gap-2 rounded-md border border-border bg-white/[0.03] px-3 py-1 text-[10.5px] text-muted">
          <span className="truncate">healthcare-equipment / equipment</span>
        </div>
      }
      bodyClassName="@container"
      footer={
        <>
          <span className="truncate">JSP · Servlets · JDBC · MySQL</span>
          <span className="placeholder-mark shrink-0 text-[9.5px]">[PLACEHOLDER] illustrative UI</span>
        </>
      }
    >
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-[30%] max-w-[180px] shrink-0 border-r border-border p-3 @md:block">
          <div className="mb-4 flex items-center gap-2 px-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent-soft">
              <Icon name="hospital" size={14} />
            </span>
            <span className="font-display text-[12px] text-text">Healthcare</span>
          </div>
          <ul className="space-y-0.5">
            {modules.map((m) => (
              <li
                key={m.label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px]",
                  m.active ? "bg-white/[0.06] text-text" : "text-muted",
                )}
              >
                <Icon name={m.icon} size={13} />
                {m.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 @md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted">Records</p>
              <p className="font-display text-[15px] text-text">Equipment</p>
            </div>
            <span className="rounded-full bg-text px-3 py-1 text-[10.5px] font-medium text-bg">+ Add</span>
          </div>

          <div className="mt-3 flex gap-1.5">
            {["All", "Available", "In maintenance", "Reserved"].map((f, i) => (
              <span
                key={f}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] whitespace-nowrap",
                  i === 0 ? "border-[rgba(147,197,253,0.35)] text-accent-soft" : "border-border text-muted",
                  i === 3 && "hidden @sm:inline",
                )}
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <div className="mono grid grid-cols-[1.4fr_1fr_0.8fr_auto] gap-3 border-b border-border bg-white/[0.02] px-3 py-2 text-[9.5px] uppercase tracking-[0.12em] text-muted">
              <span>Equipment</span>
              <span>Status</span>
              <span className="hidden @sm:block">Next service</span>
              <span className="sr-only">Actions</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[1.4fr_1fr_0.8fr_auto] items-center gap-3 border-b border-border px-3 py-2.5 last:border-0">
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 shrink-0 rounded bg-white/[0.06]" />
                  <span className="h-1.5 rounded-full bg-white/15" style={{ width: `${r.name}%` }} />
                </span>
                <span className="flex items-center gap-1.5 text-[10.5px] text-muted">
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statuses[r.status].dot)} />
                  <span className="truncate">{statuses[r.status].label}</span>
                </span>
                <span className="hidden h-1.5 rounded-full bg-white/10 @sm:block" style={{ width: `${r.date}%` }} />
                <span className="flex gap-1 text-muted/70" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
