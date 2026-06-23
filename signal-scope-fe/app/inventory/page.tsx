import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Panel } from "@/components/ui/panel";
import { apiFetch } from "@/lib/api";

export const metadata: Metadata = { title: "Inventory" };

interface AssetRow {
  sn: string;
  host: string;
  model: string;
  vendor: string;
  site: string;
  rack: string;
  os: string;
  purchased: string;
  warranty: string;
  eos: string;
}

interface SummaryItem {
  label: string;
  value: string;
  tone: string;
}

interface InventoryData {
  assets: AssetRow[];
  summary: SummaryItem[];
}

export default async function InventoryPage() {
  const { assets, summary } = await apiFetch<InventoryData>("/inventory");

  return (
    <>
      <TopBar title="Inventory" />
      <PageHeader
        title="Inventory"
        subtitle="1,314 assets · 184 racks · 6 sites · lifecycle + warranty tracking"
      />

      <main className="flex-1 px-5 py-5">
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {summary.map((s) => (
            <div
              key={s.label}
              className="panel p-3 flex items-center justify-between"
            >
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className={`font-mono text-base text-${s.tone}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <Panel title="Asset register">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  {["Serial","Hostname","Model","Vendor","Site","Rack","OS","Purchased","Warranty","EoS"].map((h) => (
                    <th key={h} className="px-2 py-2 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assets.map((r) => (
                  <tr key={r.sn} className="hover:bg-elevated/40">
                    <td className="px-2 py-2 font-mono">{r.sn}</td>
                    <td className="px-2 py-2 font-mono">{r.host}</td>
                    <td className="px-2 py-2">{r.model}</td>
                    <td className="px-2 py-2 text-muted-foreground">{r.vendor}</td>
                    <td className="px-2 py-2">{r.site}</td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">{r.rack}</td>
                    <td className="px-2 py-2 font-mono">{r.os}</td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">{r.purchased}</td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">{r.warranty}</td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">{r.eos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  );
}
