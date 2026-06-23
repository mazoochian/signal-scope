export function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function series(n: number, seed: number, base = 50, amp = 30): number[] {
  const r = rng(seed);
  return Array.from(
    { length: n },
    (_, i) => base + Math.sin(i / 3 + seed) * amp * 0.4 + (r() - 0.5) * amp
  );
}
