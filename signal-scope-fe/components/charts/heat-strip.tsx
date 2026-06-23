"use client";

interface HeatStripProps {
  data: number[];
  height?: number;
}

export function HeatStrip({ data, height = 8 }: HeatStripProps) {
  return (
    <div className="flex w-full overflow-hidden rounded" style={{ height }}>
      {data.map((v, i) => {
        const color =
          v > 90
            ? "var(--color-critical)"
            : v > 70
            ? "var(--color-warning)"
            : v > 30
            ? "var(--color-success)"
            : "var(--color-elevated)";
        return (
          <div
            key={i}
            className="flex-1"
            style={{ background: color, opacity: 0.5 + v / 200 }}
          />
        );
      })}
    </div>
  );
}
