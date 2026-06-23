import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  grow?: boolean;
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = "",
  grow = false,
}: PanelProps) {
  return (
    <section className={`panel ${grow ? "flex flex-col" : ""} ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 shrink-0">
          <div>
            {title && (
              <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-1.5">{actions}</div>
          )}
        </header>
      )}
      <div className={`p-4 ${grow ? "flex flex-col flex-1 min-h-0" : ""}`}>{children}</div>
    </section>
  );
}
