import { hrCodeSnippet, studentPerformanceData as sp, type Project } from "@/data/content";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CodeWindow } from "@/components/ui/CodeWindow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HealthcareVisual } from "@/components/visuals/HealthcareVisual";
import { HrFlowVisual } from "@/components/visuals/HrFlowVisual";
import { MeditapVisual } from "@/components/visuals/MeditapVisual";
import { ChartCard } from "./ChartCard";

function StudentPerformanceData() {
  return (
    <>
      <Stagger as="ul" className="grid gap-5 sm:grid-cols-3">
        {sp.stats.map((s) => (
          <StaggerItem as="li" key={s.label} className="card p-6 sm:p-8">
            <CountUp value={s.value} className="font-display block text-[2.75rem] font-light leading-none tracking-[-0.035em] text-text" />
            <span className="mt-3 block text-[14px] text-muted">{s.label}</span>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-5 grid gap-5">
        <ChartCard
          title={sp.scoreByStudyHours.title}
          note="Study time had the strongest effect: the average score climbs with every extra hour per day."
        >
          <LineChart
            points={sp.scoreByStudyHours.points}
            title={sp.scoreByStudyHours.title}
            xLabel={sp.scoreByStudyHours.xLabel}
            yLabel={sp.scoreByStudyHours.yLabel}
            height={320}
            showTable
          />
        </ChartCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title={sp.scoreByAttendance.title} note="High attendance averaged 70.4, versus 58.0 for low attendance.">
            <BarChart
              bars={sp.scoreByAttendance.bars}
              title={sp.scoreByAttendance.title}
              valueLabel="Avg score"
              decimals={1}
              max={100}
              ticks={[0, 25, 50, 75, 100]}
              showTable
            />
          </ChartCard>
          <ChartCard title={`${sp.gradeDistribution.title} (25,000 students)`} note="Hover a segment or legend row for details.">
            <DonutChart
              segments={sp.gradeDistribution.segments}
              total={sp.gradeDistribution.total}
              title={sp.gradeDistribution.title}
              showTable
            />
          </ChartCard>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title={sp.weakSubjectHighScorers.title} note="Even among students scoring 80+, Science was the most common weak subject.">
            <BarChart
              bars={sp.weakSubjectHighScorers.bars}
              title={sp.weakSubjectHighScorers.title}
              valueLabel="Students"
              orientation="horizontal"
              max={50}
              ticks={[0, 10, 20, 30, 40, 50]}
              showTable
            />
          </ChartCard>
          <Reveal className="h-full">
            <div className="flex h-full flex-col">
              <p className="font-display px-1 text-[17px] tracking-[-0.015em] text-text">The query behind “study level”</p>
              <p className="mt-1.5 px-1 text-[14px] text-muted">One of the 10 HiveQL queries: CASE-based grouping with an aggregate.</p>
              <CodeWindow code={sp.query} lang="sql" label="study_level.hql" className="mt-6 flex-1" />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}

function ChecklistCard({ title, icon, items }: { title: string; icon: IconName; items: string[] }) {
  return (
    <Reveal className="h-full">
      <div className="card glow-hover h-full p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="text-accent-soft">
            <Icon name={icon} size={20} />
          </span>
          <p className="font-display text-[17px] tracking-[-0.015em] text-text">{title}</p>
        </div>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3 py-3.5 text-[15px] text-muted">
              <Icon name="check" size={16} className="shrink-0 text-accent-soft" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

const SECTION: Record<Project["visual"], { eyebrow: string; heading: string; intro: string }> = {
  "student-performance": {
    eyebrow: "The data",
    heading: "What *25,000 records* revealed.",
    intro: "Charts drawn from the project's real query results. Hover for exact values, or open “View data” for the table.",
  },
  "hr-analysis": {
    eyebrow: "How it works",
    heading: "From two datasets to *one story*.",
    intro: "The analysis pipeline, from the two Kaggle datasets to a dashboard for HR teams.",
  },
  meditap: {
    eyebrow: "How it works",
    heading: "Hardware, cloud and app, *in sync*.",
    intro: "The dispenser and the caregiver app stay in sync through Firebase Realtime Database.",
  },
  "healthcare-system": {
    eyebrow: "How it works",
    heading: "One place for *every record*.",
    intro: "A Java web application built on JSP, Servlets and JDBC with a MySQL database.",
  },
};

/** Project-specific charts and visuals. */
export function ProjectData({ project }: { project: Project }) {
  const section = SECTION[project.visual];
  return (
    <section aria-labelledby="data-heading" className="section-y cv relative pt-0 sm:pt-0">
      <div aria-hidden="true" className="glow-navy -left-60 top-40 h-[640px] w-[640px]" />
      <div className="container-x relative">
        <SectionHeader id="data-heading" eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
        <div className="mt-12 sm:mt-16">
          {project.visual === "student-performance" && <StudentPerformanceData />}

          {project.visual === "hr-analysis" && (
            <div className="grid items-start gap-5 lg:grid-cols-2">
              <Reveal>
                <HrFlowVisual />
              </Reveal>
              <Reveal delay={0.1}>
                <CodeWindow code={hrCodeSnippet} lang="python" label="attrition_analysis.py" />
                <p className="mt-4 px-1 text-[14px] text-muted">
                  Factors examined: department, job role, age, overtime, productivity and satisfaction.
                </p>
              </Reveal>
            </div>
          )}

          {project.visual === "meditap" && (
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <Reveal>
                <MeditapVisual />
              </Reveal>
              <ChecklistCard
                title="Functional testing"
                icon="check"
                items={["Dispensing accuracy", "Compartment selection", "Response time", "Medication logging"]}
              />
            </div>
          )}

          {project.visual === "healthcare-system" && (
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <Reveal>
                <HealthcareVisual />
              </Reveal>
              <ChecklistCard
                title="Modules"
                icon="layers"
                items={["Login and registration", "Equipment records", "Maintenance records", "Reservations"]}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
