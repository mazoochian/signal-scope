import type { Metadata } from "next";
import { Layers, Maximize2, Plus, Minus, RotateCcw, Filter } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Topology" };

type NodeKind = "core" | "agg" | "access" | "fw" | "router" | "ap" | "wan";

interface TopoNode {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: NodeKind;
  status: StatusKind;
}

interface TopoEdge {
  from: string;
  to: string;
  util?: number;
  status?: StatusKind;
}

interface PathHop {
  hop: string;
  device: string;
  latency: string;
}

interface TopologyData {
  nodes: TopoNode[];
  edges: TopoEdge[];
  pathTrace: PathHop[];
}

const NODE_LABEL: Record<NodeKind, string> = {
  core: "CR", agg: "AG", access: "AC", fw: "FW", router: "RT", ap: "AP", wan: "WAN",
};

function nodeColor(status: StatusKind): string {
  if (status === "up") return "var(--color-success)";
  if (status === "warn") return "var(--color-warning)";
  return "var(--color-critical)";
}

function edgeColor(e: TopoEdge): string {
  if (e.status === "down") return "var(--color-critical)";
  if (e.status === "warn") return "var(--color-warning)";
  if ((e.util ?? 0) > 70) return "var(--color-warning)";
  return "var(--color-primary)";
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-7 w-7 place-items-center rounded border border-border bg-panel text-muted-foreground hover:bg-elevated hover:text-foreground">
      {children}
    </button>
  );
}

export default async function TopologyPage() {
  const { nodes, edges, pathTrace } = await apiFetch<TopologyData>("/topology");
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <>
      <TopBar title="Topology" />
      <PageHeader
        title="Topology"
        subtitle="Layer 2/3 · auto-generated from LLDP, CDP, BGP, and ARP discovery"
        actions={
          <>
            <select className="h-8 rounded-md border border-border bg-panel px-2 text-xs">
              <option>Layer 2 + Layer 3</option>
              <option>Layer 2 only</option>
              <option>Layer 3 only</option>
              <option>WAN / MPLS</option>
            </select>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs">
              <Filter className="h-3.5 w-3.5" />
              Site: HQ-NYC
            </button>
          </>
        }
      />

      <main className="flex-1 px-5 py-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <Panel
            className="xl:col-span-3"
            title="Live Topology Map"
            subtitle="Drag to pan · scroll to zoom · double-click to expand"
            actions={
              <>
                <IconBtn><Plus className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn><Minus className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn><RotateCcw className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn><Layers className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn><Maximize2 className="h-3.5 w-3.5" /></IconBtn>
              </>
            }
          >
            <div className="relative overflow-hidden rounded-md border border-border bg-background">
              <div className="absolute inset-0 noc-grid opacity-40" />
              <svg viewBox="0 0 1320 540" className="relative h-[560px] w-full">
                {edges.map((e, i) => {
                  const a = byId[e.from];
                  const b = byId[e.to];
                  const stroke = edgeColor(e);
                  return (
                    <g key={i}>
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={1 + (e.util ?? 30) / 50} strokeOpacity={0.55} />
                      {e.status === "down" && (
                        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={2} strokeDasharray="4 4" />
                      )}
                      <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} fontSize="9" fill="var(--color-muted-foreground)" textAnchor="middle">
                        {e.util ?? ""}{e.util ? "%" : ""}
                      </text>
                    </g>
                  );
                })}
                {nodes.map((n) => (
                  <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                    <circle r="22" fill="var(--color-panel)" stroke="var(--color-border)" />
                    <circle r="22" fill="none" stroke={nodeColor(n.status)} strokeWidth="2" />
                    {n.status === "down" && (
                      <circle r="22" fill="none" stroke={nodeColor(n.status)} strokeWidth="2" className="pulse-ring" />
                    )}
                    <text textAnchor="middle" dy="4" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="var(--color-foreground)" fontWeight="600">
                      {NODE_LABEL[n.kind]}
                    </text>
                    <text textAnchor="middle" y="40" fontSize="10" fill="var(--color-muted-foreground)">
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-3 left-3 flex gap-2 text-[10px]">
                <span className="chip"><span className="status-dot text-success" /> Up</span>
                <span className="chip"><span className="status-dot text-warning" /> Warning</span>
                <span className="chip"><span className="status-dot text-critical" /> Down</span>
              </div>
              <div className="absolute bottom-3 right-3 rounded-md border border-border bg-panel/80 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                {nodes.length} nodes · {edges.length} links · updated 2s ago
              </div>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="Selected · core-sw-01" subtitle="10.0.10.2 · Catalyst 9500-48Y4C">
              <dl className="grid grid-cols-2 gap-y-2 text-xs">
                <dt className="text-muted-foreground">Status</dt>
                <dd><StatusPill kind="up">Up</StatusPill></dd>
                <dt className="text-muted-foreground">Uptime</dt>
                <dd className="font-mono">312d 7h</dd>
                <dt className="text-muted-foreground">IOS-XE</dt>
                <dd className="font-mono">17.12.03a</dd>
                <dt className="text-muted-foreground">CPU</dt>
                <dd className="font-mono">23%</dd>
                <dt className="text-muted-foreground">Mem</dt>
                <dd className="font-mono">58%</dd>
                <dt className="text-muted-foreground">Temp</dt>
                <dd className="font-mono">42 °C</dd>
                <dt className="text-muted-foreground">Neighbors</dt>
                <dd className="font-mono">14 LLDP</dd>
                <dt className="text-muted-foreground">VLANs</dt>
                <dd className="font-mono">62</dd>
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["SSH", "Backup", "Re-poll", "Drill-down"].map((a) => (
                  <button key={a} className="rounded-md border border-border bg-panel px-2.5 py-1 text-[11px] hover:bg-elevated">
                    {a}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Path Trace" subtitle="10.42.5.18 → 8.8.8.8">
              <ol className="space-y-1.5 text-xs">
                {pathTrace.map((h) => (
                  <li key={h.hop} className="flex items-center justify-between rounded border border-border bg-elevated/40 px-2 py-1">
                    <span className="font-mono text-muted-foreground">{h.hop}</span>
                    <span className="flex-1 px-2 font-mono text-foreground">{h.device}</span>
                    <span className="font-mono text-primary">{h.latency}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>
      </main>
    </>
  );
}
