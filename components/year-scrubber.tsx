"use client";

import type { VespaModel } from "@/lib/vespa-data";

function yearNum(y: string): number {
  return parseInt(y.match(/\d{4}/)?.[0] ?? "0", 10);
}

export function YearScrubber({
  models,
  selected,
  onYear,
}: {
  models: VespaModel[];
  selected: VespaModel;
  onYear: (year: number) => void;
}) {
  const years = models.map((m) => yearNum(m.y));
  const min = Math.min(...years);
  const max = Math.max(...years);
  return (
    <div className="border-y border-zinc-300 bg-zinc-100 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-4xl font-black text-rosso tabular-nums">
          {selected.y}
        </span>
        <span className="font-mono text-xs text-zinc-600">
          {selected.m} — {selected.engine}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={yearNum(selected.y)}
        onChange={(e) => onYear(Number(e.target.value))}
        className="mt-3 w-full accent-rosso"
        aria-label="Scrub the model years"
      />
      <div className="ticks" aria-hidden />
      <div className="mt-1 flex justify-between font-mono text-[11px] text-zinc-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
