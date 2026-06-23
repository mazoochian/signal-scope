import type { Metadata } from "next";
import { Search, Filter, MoreHorizontal, Server, Router, Wifi, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { Sparkline } from "@/components/charts/sparkline";
import { AddDeviceDialog } from "@/components/devices/add-device-dialog";
import { apiFetch } from "@/lib/api";
import type { StatusKind } from "@/types";

export const metadata: Metadata = { title: "Devices" };

const ICON_MAP: Record<string, LucideIcon> = {
  server: Server,
  router: Router,
  wifi: Wifi,
  shield: Shield,
};

interface DeviceRow {
  id: number; name: string; ip: string; vendor: string; model: string; role: string;
  site: string; status: StatusKind; cpu: number; mem: number; up: string;
  icon: string; trend: number[];
}

interface VendorCount { label: string; n: number }

interface DevicesData { devices: DeviceRow[]; vendorCounts: VendorCount[] }

function UtilBar({ v }: { v: number }) {
  const tone = v > 85 ? "var(--color-critical)" : v > 70 ? "var(--color-warning)" : "var(--color-primary)";
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 text-right">{v}%</span>
      <div className="h-1 w-16 overflow-hidden rounded-full bg-elevated">
        <div className="h-full" style={{ width: `${v}%`, background: tone }} />
      </div>
    </div>
  );
}

export default async function DevicesPage() {
  const { devices, vendorCounts } = await apiFetch<DevicesData>("/devices");

  return (
    <>
      <TopBar title="Devices" />
      <PageHeader
        title="Devices"
        subtitle="1,314 monitored · 1,284 up · 23 warning · 7 down"
        actions={
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input className="h-8 w-64 rounded-md border border-input bg-panel pl-7 pr-2 text-xs" placeholder="Filter name, IP, MAC, vendor…" />
            </div>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-panel px-3 text-xs">
              <Filter className="h-3.5 w-3.5" /> Saved views
            </button>
          </>
        }
      />

      <main className="flex-1 px-5 py-5">
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          {vendorCounts.map((v) => (
            <div key={v.label} className="panel flex items-center justify-between p-3">
              <span className="text-xs text-muted-foreground">{v.label}</span>
              <span className="font-mono text-base">{v.n}</span>
            </div>
          ))}
        </div>

        <Panel
          title="Inventory"
          subtitle="Click a row to drill into device detail"
          actions={<AddDeviceDialog />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  {["Device","IP","Vendor / Model","Role","Site","Status","CPU","Mem","Uptime","Trend",""].map((h) => (
                    <th key={h} className="px-2 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {devices.map((r) => {
                  const Icon = ICON_MAP[r.icon] ?? Server;
                  return (
                    <tr key={r.id} className="hover:bg-elevated/40">
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-primary" />
                          <span className="font-mono text-foreground">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 font-mono text-muted-foreground">{r.ip}</td>
                      <td className="px-2 py-2">
                        <div className="text-foreground">{r.vendor}</div>
                        <div className="text-[10px] text-muted-foreground">{r.model}</div>
                      </td>
                      <td className="px-2 py-2"><span className="chip">{r.role}</span></td>
                      <td className="px-2 py-2 text-muted-foreground">{r.site}</td>
                      <td className="px-2 py-2"><StatusPill kind={r.status}>{r.status}</StatusPill></td>
                      <td className="px-2 py-2 font-mono"><UtilBar v={r.cpu} /></td>
                      <td className="px-2 py-2 font-mono"><UtilBar v={r.mem} /></td>
                      <td className="px-2 py-2 font-mono text-muted-foreground">{r.up}</td>
                      <td className="px-2 py-2 w-32">
                        <Sparkline
                          data={r.trend}
                          height={22}
                          fill={false}
                          color={r.status === "down" ? "var(--color-critical)" : "var(--color-primary)"}
                        />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button className="grid h-6 w-6 place-items-center rounded hover:bg-elevated">
                          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  );
}
