"use client";

import { useId } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
  stretch?: boolean;
}

export function Sparkline({
  data,
  color = "var(--color-primary)",
  height = 36,
  fill = true,
  stretch = false,
}: SparklineProps) {
  const w = 100;
  const h = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map(
    (v, i) => [i * step, h - ((v - min) / range) * h] as const
  );
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  const gradId = `sparkline-grad-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={stretch ? { height: "100%", width: "100%", display: "block" } : { height, width: "100%" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
