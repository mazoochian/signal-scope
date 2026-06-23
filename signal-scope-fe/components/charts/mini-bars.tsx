"use client";

interface MiniBarsProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniBars({
  data,
  color = "var(--color-cyan)",
  height = 36,
}: MiniBarsProps) {
  const max = Math.max(...data) || 1;
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: 0.4 + (v / max) * 0.6,
          }}
        />
      ))}
    </div>
  );
}
