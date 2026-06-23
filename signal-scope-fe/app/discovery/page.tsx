import type { Metadata } from "next";
import { Radar, Play } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Discovery" };

interface DiscoveryJob {
  name: string;
  method: string;
  progress: number;
  found: number;
  newDevices: number;
}

interface RecentDevice {
  ip: string;
  host: string;
  vendor: string;
  status: StatusKind;
  ago: string;
}

interface DiscoveryData {
  jobs: DiscoveryJob[];
  recentlyDiscovered: RecentDevice[];
}

export default async function DiscoveryPage() {
  const { jobs, recentlyDiscovered } = await apiFetch<DiscoveryData>("/discovery");

  return (
    <>
      <TopBar title="Discovery" />
      <PageHeader
        title="Discovery"
        subtitle="Automated network discovery · SNMP walks · LLDP/CDP · ARP · routing tables · ICMP"
        actions={
          <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground">
            <Play className="h-3.5 w-3.5" />
            Run discovery
          </button>
        }
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" title="Active discovery jobs">
            <ul className="space-y-2 text-xs">
              {jobs.map((j) => (
                <li
                  key={j.name}
                  className="rounded-md border border-border bg-elevated/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radar className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono">{j.name}</span>
                    </div>
                    <span className="chip">{j.method}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel">
                    <div
                      className="h-full"
                      style={{
                        width: `${j.progress}%`,
                        background: "var(--gradient-primary)",
                      }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {j.progress}% · {j.found} devices found
                    </span>
                    {j.newDevices > 0 ? (
                      <span className="text-success">+{j.newDevices} new</span>
                    ) : (
                      <span>no new devices</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Recently discovered">
            <ul className="space-y-1.5 text-xs">
              {recentlyDiscovered.map((d) => (
                <li
                  key={d.ip}
                  className="flex items-center justify-between rounded border border-border bg-elevated/40 p-2"
                >
                  <div>
                    <div className="font-mono">{d.host}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {d.ip} · {d.vendor}
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusPill kind={d.status}>{d.status}</StatusPill>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {d.ago} ago
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </main>
    </>
  );
}
