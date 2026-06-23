import type { Metadata } from "next";
import { ShieldAlert, CheckCheck, BellOff, Workflow, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { Sparkline } from "@/components/charts/sparkline";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Alerts" };

interface Alert {
  id: string; sev: string; kind: StatusKind; title: string; device: string;
  iface: string; rule: string; ack: boolean; age: string; rc: string; children?: number;
}

interface SeverityCount { label: string; n: number; color: string }

interface AlertsData {
  alerts: Alert[];
  severityCounts: SeverityCount[];
  volumeChart: number[];
  rootCauseChain: string[];
}

export default async function AlertsPage() {
  const { alerts, severityCounts, volumeChart, rootCauseChain } =
    await apiFetch<AlertsData>("/alerts");

  return (
    <>
      <TopBar title="Alerts" />
      <PageHeader
        title="Alerts"
        subtitle="37 open · 12 acknowledged · root-cause correlation engine: ACTIVE"
        actions={
          <>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs">
              <CheckCheck className="h-3.5 w-3.5" /> Acknowledge
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs">
              <BellOff className="h-3.5 w-3.5" /> Suppress
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground">
              <Workflow className="h-3.5 w-3.5" /> Open runbook
            </button>
          </>
        }
      />

      <main className="flex-1 px-5 py-5">
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          {severityCounts.map((v) => (
            <div key={v.label} className="panel flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{v.label}</span>
              <span className={`font-mono text-lg ${v.color}`}>{v.n}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2" title="Open Alerts" subtitle="Auto-correlated · grouped by root-cause">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    {["Sev","ID","Title","Device","Rule","Age","RC",""].map((h) => (
                      <th key={h} className="px-2 py-2 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {alerts.map((a) => (
                    <tr key={a.id} className={`hover:bg-elevated/40 ${a.rc === "ROOT" ? "bg-critical/5" : ""}`}>
                      <td className="px-2 py-2"><StatusPill kind={a.kind}>{a.sev}</StatusPill></td>
                      <td className="px-2 py-2 font-mono text-muted-foreground">{a.id}</td>
                      <td className="px-2 py-2">
                        {a.title}{a.ack && <span className="ml-2 chip">ACK</span>}
                      </td>
                      <td className="px-2 py-2 font-mono text-foreground">
                        {a.device}<span className="text-muted-foreground"> · {a.iface}</span>
                      </td>
                      <td className="px-2 py-2 font-mono text-muted-foreground">{a.rule}</td>
                      <td className="px-2 py-2 font-mono text-muted-foreground">{a.age}</td>
                      <td className="px-2 py-2">
                        {a.rc === "ROOT" ? (
                          <span className="chip text-critical border-critical/40">ROOT · {a.children} children</span>
                        ) : a.rc === "CHILD" ? (
                          <span className="chip">child</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="Root Cause" subtitle="ALR-90213 · confidence 96%">
              <div className="rounded-md border border-critical/30 bg-critical/10 p-3">
                <div className="flex items-center gap-2 text-critical">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="text-sm font-semibold">edge-rtr-nyc-01 unreachable</span>
                </div>
                <p className="mt-1 text-[11px] text-foreground/80">
                  Upstream BGP session loss has cascaded into 5 dependent alarms.
                  Suppressing children is recommended until root condition clears.
                </p>
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px]">
                {rootCauseChain.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="status-dot text-critical" /> {x}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Alert Volume · 24h" subtitle="3,219 events · 184 deduplicated">
              <Sparkline data={volumeChart} color="var(--color-critical)" height={120} />
            </Panel>
          </div>
        </div>
      </main>
    </>
  );
}
