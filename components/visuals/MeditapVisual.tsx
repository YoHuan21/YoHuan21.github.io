import { Icon } from "@/components/ui/Icon";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { FlowLine } from "./FlowLine";

const peripherals = ["DS3231 RTC", "Servo motor", "Buzzer", "Push button"];
const appFeatures = ["Scheduling", "Notifications", "User management", "Medication logs"];

function Column({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-border-strong bg-white/[0.025] p-4">
      <p className="mono text-[9.5px] uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
      <p className="font-display mt-0.5 text-[14px] text-text">{title}</p>
      {children}
    </div>
  );
}

/** System diagram: ESP32 + RTC + servo ↔ Firebase ↔ Android app. Real components only. */
export function MeditapVisual() {
  return (
    <WindowFrame label="meditap · system overview" bodyClassName="@container p-5 md:p-6">
      <div className="flex flex-col items-stretch @min-[30rem]:flex-row @min-[30rem]:items-center">
        {/* Device */}
        <div className="@min-[30rem]:w-[38%]">
          <Column eyebrow="IoT dispenser" title="Hardware">
            <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-[rgba(147,197,253,0.35)] bg-[rgba(59,130,246,0.12)] px-3 py-2 shadow-[0_0_30px_-10px_rgba(59,130,246,0.7)]">
              <span className="text-accent-soft">
                <Icon name="chip" size={18} />
              </span>
              <span className="font-display text-[13px] text-text">ESP32</span>
              <span className="relative ml-auto flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-soft" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {peripherals.map((p) => (
                <li key={p} className="mono rounded-md border border-border px-2 py-1.5 text-[10px] leading-tight text-muted">
                  {p}
                </li>
              ))}
            </ul>
          </Column>
        </div>

        <Link />

        {/* Cloud */}
        <div className="@min-[30rem]:w-[24%]">
          <div className="relative flex flex-col items-center rounded-xl border border-border-strong bg-white/[0.025] px-3 py-4 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(147,197,253,0.35)] bg-[rgba(59,130,246,0.12)] text-accent-soft">
              <Icon name="cloud" size={20} />
            </span>
            <p className="font-display mt-2 text-[13px] leading-snug text-text">Firebase</p>
            <p className="mono text-[9.5px] uppercase tracking-[0.14em] text-muted">Realtime Database</p>
          </div>
        </div>

        <Link />

        {/* App */}
        <div className="@min-[30rem]:w-[38%]">
          <Column eyebrow="For caregivers" title="Android app">
            <ul className="mt-3 space-y-1.5">
              {appFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[12px] text-muted">
                  <span className="text-accent-soft">
                    <Icon name="check" size={13} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mono mt-3 text-[9.5px] uppercase tracking-[0.14em] text-muted">Java · Android Studio</p>
          </Column>
        </div>
      </div>
    </WindowFrame>
  );
}

/** Bidirectional sync link: vertical when stacked, horizontal when side by side. */
function Link() {
  return (
    <>
      <div className="mx-auto h-8 w-px @min-[30rem]:hidden">
        <FlowLine orientation="vertical" direction="both" duration={2.4} />
      </div>
      <div className="hidden w-[6%] min-w-6 @min-[30rem]:block">
        <FlowLine orientation="horizontal" direction="both" duration={2.4} />
      </div>
    </>
  );
}
