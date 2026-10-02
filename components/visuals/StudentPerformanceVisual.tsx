import { LineChart } from "@/components/charts/LineChart";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { studentPerformanceData as data } from "@/data/content";

/** Values derived directly from the project results (no invented numbers). */
const kpis = [
  { label: "Avg · <2 h/day", value: "39.8", fill: 0.398 },
  { label: "Avg · >4 h/day", value: "77.9", fill: 0.779 },
  { label: "Attendance gap", value: "+12.4", fill: 0.124, note: "pts" },
];

/** Dashboard-style window: KPI row + the study-hours line chart (hero visual for this project). */
export function StudentPerformanceVisual({ size = "card" }: { size?: "card" | "hero" }) {
  const hero = size === "hero";
  return (
    <WindowFrame
      label="avg_score_by_study_hours"
      footer={
        <>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            25,000 records · HDFS → Hive → Power BI
          </span>
          <span className="hidden sm:inline">DSC650</span>
        </>
      }
    >
      <div className={hero ? "p-6 md:p-8" : "p-5 md:p-6"}>
        <dl className="grid grid-cols-3 gap-4 md:gap-6">
          {kpis.map((k) => (
            <div key={k.label} className="min-w-0">
              <dt className="mono min-h-[2.6em] text-[10px] uppercase leading-[1.3] tracking-[0.12em] text-muted sm:min-h-0">{k.label}</dt>
              <dd className="mt-1.5">
                <span className={hero ? "font-display text-[26px] font-light tracking-[-0.02em] text-text md:text-[32px]" : "font-display text-[20px] font-light tracking-[-0.02em] text-text md:text-[24px]"}>
                  {k.value}
                </span>
                {k.note && <span className="mono ml-1 text-[10px] text-muted">{k.note}</span>}
                <span className="mt-2.5 block h-px w-full bg-white/10" aria-hidden="true">
                  <span className="block h-px origin-left bg-accent-soft/80" style={{ transform: `scaleX(${k.fill})` }} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <div className={hero ? "mt-8" : "mt-6"}>
          <LineChart
            points={data.scoreByStudyHours.points}
            title={data.scoreByStudyHours.title}
            xLabel={data.scoreByStudyHours.xLabel}
            yLabel={data.scoreByStudyHours.yLabel}
            compact={!hero}
            height={hero ? 300 : 200}
          />
        </div>
      </div>
    </WindowFrame>
  );
}
