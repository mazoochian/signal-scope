import type { Metadata } from "next";
import { GitCompare, History, Download, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";

export const metadata: Metadata = { title: "Configuration Management" };

type DiffLineType = "ctx" | "rem" | "add";

interface DiffLine {
  t: DiffLineType;
  s: string;
}

const DIFF: DiffLine[] = [
  { t: "ctx", s: "interface TenGigabitEthernet1/0/24" },
  { t: "ctx", s: "  description uplink → agg-sw-hq-01" },
  { t: "rem", s: "  switchport mode trunk" },
  { t: "rem", s: "  switchport trunk allowed vlan 10,20,30" },
  { t: "add", s: "  switchport mode trunk" },
  { t: "add", s: "  switchport trunk allowed vlan 10,20,30,40,99" },
  { t: "add", s: "  storm-control broadcast level 1.00" },
  { t: "ctx", s: "!" },
  { t: "ctx", s: "router bgp 65000" },
  { t: "rem", s: "  neighbor 10.0.0.5 remote-as 65001" },
  { t: "add", s: "  neighbor 10.0.0.5 remote-as 65001 password 7 ******" },
  { t: "add", s: "  neighbor 10.0.0.5 timers 10 30" },
];

const diffStyles: Record<DiffLineType, string> = {
  add: "bg-success/10 text-success",
  rem: "bg-critical/10 text-critical",
  ctx: "text-muted-foreground",
};

const BACKUP_STATUS = [
  { d: "core-sw-01", last: "2h", v: 18, drift: false },
  { d: "core-sw-02", last: "2h", v: 14, drift: false },
  { d: "edge-rtr-nyc-02", last: "1h", v: 42, drift: false },
  { d: "agg-rtr-lax-01", last: "4h", v: 8, drift: true },
  { d: "fw-edge-sea-01", last: "6h", v: 21, drift: true },
  { d: "acc-sw-hq-09", last: "3h", v: 11, drift: false },
  { d: "wlc-hq-01", last: "12h", v: 5, drift: false },
];

export default function ConfigurationPage() {
  return (
    <>
      <TopBar title="Configuration Management" />
      <PageHeader
        title="Configuration Management"
        subtitle="3,184 backups stored · 12 drift alerts · SSH / NETCONF / RESTCONF / gNMI"
        actions={
          <>
            {/* TODO: implement version history browser */}
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs">
              <History className="h-3.5 w-3.5" />
              Version history
            </button>
            {/* TODO: implement backup-all action */}
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground">
              <Download className="h-3.5 w-3.5" />
              Backup all
            </button>
          </>
        }
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel title="Devices · backup status">
            <ul className="space-y-1.5 text-xs">
              {BACKUP_STATUS.map((r) => (
                <li
                  key={r.d}
                  className="flex items-center justify-between rounded border border-border bg-elevated/40 p-2"
                >
                  <div>
                    <div className="font-mono">{r.d}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      v{r.v} · last {r.last} ago
                    </div>
                  </div>
                  {r.drift ? (
                    <span className="chip text-warning border-warning/40">
                      <ShieldCheck className="h-3 w-3" />
                      drift
                    </span>
                  ) : (
                    <StatusPill kind="up">in sync</StatusPill>
                  )}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            className="xl:col-span-2"
            title="Diff · core-sw-01 · v17 → v18"
            subtitle="committed by j.ramirez · 2024-06-21 13:48 UTC · pending approval"
            actions={
              // TODO: implement side-by-side diff view
              <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-panel px-2.5 text-[11px]">
                <GitCompare className="h-3 w-3" />
                Side-by-side
              </button>
            }
          >
            <div className="rounded-md border border-border bg-background font-mono text-[11.5px] leading-relaxed">
              {DIFF.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-3 px-3 py-0.5 ${diffStyles[line.t]}`}
                >
                  <span className="w-6 text-right opacity-50">{i + 1}</span>
                  <span className="w-3 opacity-70">
                    {line.t === "add" ? "+" : line.t === "rem" ? "-" : " "}
                  </span>
                  <span className="flex-1 whitespace-pre">{line.s}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* TODO: implement approve/push action */}
              <button className="rounded-md border border-success/40 bg-success/15 px-3 py-1.5 text-xs font-semibold text-success">
                Approve & push
              </button>
              {/* TODO: implement request review action */}
              <button className="rounded-md border border-border bg-panel px-3 py-1.5 text-xs">
                Request review
              </button>
              {/* TODO: implement reject action */}
              <button className="rounded-md border border-critical/40 bg-critical/15 px-3 py-1.5 text-xs text-critical">
                Reject
              </button>
            </div>
          </Panel>
        </div>
      </main>
    </>
  );
}
