import type { ReactNode } from "react";
import type { StatusKind } from "@/types";

interface StatusPillProps {
  kind: StatusKind;
  children: ReactNode;
}

const kindStyles: Record<StatusKind, string> = {
  up: "bg-success/15 text-success border-success/30",
  warn: "bg-warning/15 text-warning border-warning/30",
  down: "bg-critical/15 text-critical border-critical/30",
  info: "bg-info/15 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusPill({ kind, children }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${kindStyles[kind]}`}
    >
      <span className="status-dot" />
      {children}
    </span>
  );
}
