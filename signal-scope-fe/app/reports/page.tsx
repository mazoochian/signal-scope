import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { FileBarChart2, Calendar, Mail, Download } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = { title: "Reports" };

interface ReportTemplate {
  name: string;
  desc: string;
  freq: string;
  next: string;
  fmt: string;
}

const TEMPLATES: ReportTemplate[] = [
  {
    name: "Executive NOC Summary",
    desc: "Single-page KPI roll-up · SLA, incidents, capacity",
    freq: "Weekly",
    next: "Mon 06:00",
    fmt: "PDF",
  },
  {
    name: "WAN SLA Report",
    desc: "Per-circuit availability, MOS, loss, jitter",
    freq: "Monthly",
    next: "Jul 01",
    fmt: "PDF + CSV",
  },
  {
    name: "Capacity Planning",
    desc: "Interface 95th-percentile · 30 & 90 day projections",
    freq: "Monthly",
    next: "Jul 01",
    fmt: "Excel",
  },
  {
    name: "Configuration Compliance",
    desc: "Drift vs golden config · per-vendor checklist",
    freq: "Weekly",
    next: "Sun 22:00",
    fmt: "PDF",
  },
  {
    name: "Inventory Lifecycle",
    desc: "Warranty, EoS, EoL exposure",
    freq: "Quarterly",
    next: "Jul 01",
    fmt: "Excel",
  },
  {
    name: "Incident Postmortem",
    desc: "MTTR, RCA, follow-up actions",
    freq: "On demand",
    next: "—",
    fmt: "PDF",
  },
];

function MetaBox({ l, v, icon: Icon }: { l: string; v: string; icon: LucideIcon }) {
  return (
    <div className="rounded-md border border-border bg-elevated/40 p-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {l}
      </div>
      <div className="mt-0.5 font-mono">{v}</div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <>
      <TopBar title="Reports" />
      <PageHeader
        title="Reports"
        subtitle="Scheduled and on-demand reports · PDF / Excel / CSV"
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TEMPLATES.map((r) => (
            <Panel key={r.name} title={r.name} subtitle={r.desc}>
              <div className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
                <MetaBox l="Frequency" v={r.freq} icon={Calendar} />
                <MetaBox l="Next run" v={r.next} icon={Calendar} />
                <MetaBox l="Format" v={r.fmt} icon={FileBarChart2} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {/* TODO: implement report edit */}
                <button className="rounded-md border border-border bg-panel px-2.5 py-1 text-[11px] hover:bg-elevated">
                  Edit
                </button>
                {/* TODO: implement recipients management */}
                <button className="inline-flex items-center gap-1 rounded-md border border-border bg-panel px-2.5 py-1 text-[11px] hover:bg-elevated">
                  <Mail className="h-3 w-3" />
                  Recipients
                </button>
                {/* TODO: implement run-now action */}
                <button className="ml-auto inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                  <Download className="h-3 w-3" />
                  Run now
                </button>
              </div>
            </Panel>
          ))}
        </div>
      </main>
    </>
  );
}
