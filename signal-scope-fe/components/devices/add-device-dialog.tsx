"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const ROLES = ["Core SW", "Edge Rtr", "Agg Rtr", "Firewall", "Access SW", "WLC"];
const SITES = ["HQ-NYC", "LAX", "SEA", "DCA", "FRA"];
const ICONS = [
  { value: "server", label: "Server" },
  { value: "router", label: "Router" },
  { value: "wifi", label: "Wireless" },
  { value: "shield", label: "Firewall" },
];

interface FormState {
  name: string; ip: string; vendor: string; model: string;
  role: string; site: string; icon: string;
}

const EMPTY: FormState = { name: "", ip: "", vendor: "", model: "", role: ROLES[0], site: SITES[0], icon: "server" };

export function AddDeviceDialog({ buttonClassName }: { buttonClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const firstRef = useRef<HTMLInputElement>(null);

  function field(key: keyof FormState) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  function openDialog() {
    setForm(EMPTY);
    setError(null);
    setOpen(true);
    setTimeout(() => firstRef.current?.focus(), 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.ip.trim() || !form.vendor.trim() || !form.model.trim()) {
      setError("Name, IP, Vendor and Model are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={openDialog}
        className={buttonClassName ?? "inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"}
      >
        <Plus className="h-3.5 w-3.5" /> Add device
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="panel w-full max-w-md">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">Add device</h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded hover:bg-elevated"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Hostname / Name">
                  <input ref={firstRef} className="field-input" placeholder="core-sw-03" {...field("name")} />
                </Field>
                <Field label="IP Address">
                  <input className="field-input" placeholder="10.0.0.5" {...field("ip")} />
                </Field>
                <Field label="Vendor">
                  <input className="field-input" placeholder="Cisco" {...field("vendor")} />
                </Field>
                <Field label="Model">
                  <input className="field-input" placeholder="C9300-48P" {...field("model")} />
                </Field>
                <Field label="Role">
                  <select className="field-input" {...field("role")}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Site">
                  <select className="field-input" {...field("site")}>
                    {SITES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Icon" className="col-span-2">
                  <select className="field-input" {...field("icon")}>
                    {ICONS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </Field>
              </div>

              {error && <p className="text-xs text-[var(--color-critical)]">{error}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 items-center rounded-md border border-border bg-elevated px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50"
                >
                  {busy ? "Adding…" : "Add device"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
