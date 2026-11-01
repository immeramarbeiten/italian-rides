"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { VESPA_MODELS, type VespaModel } from "@/lib/vespa-data";
import { slugify } from "@/lib/models";
import { VespaLineArt } from "@/components/vespa-lineart";
import { cn } from "@/lib/utils";

function shortYear(y: string): string {
  return y.match(/\d{4}/)?.[0] ?? y;
}

export function Frieze({
  models = VESPA_MODELS,
  selected = null,
  onSelect,
  link = false,
  hrefFor,
  art,
  timeline = false,
}: {
  models?: VespaModel[];
  selected?: string | null;
  onSelect?: (name: string) => void;
  /** when true, frames link out instead of selecting */
  link?: boolean;
  /** link target per model name; defaults to the model page */
  hrefFor?: (name: string) => string;
  /** optional photo art per model name; falls back to line art */
  art?: Record<string, string>;
  timeline?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const first = models[0] ? shortYear(models[0].y) : "";
  const last = models.length ? shortYear(models[models.length - 1].y) : "";
  const href = (name: string) =>
    hrefFor ? hrefFor(name) : `/models/${slugify(name)}`;
  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };
  return (
    <div>
      <div className="flex items-center justify-between border-b border-line pb-3 font-mono text-[11px] tracking-[0.1em] text-zinc-600">
        <span>
          THE FRIEZE — {first} → {last}
        </span>
        <span className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Scroll timeline back"
            className="border border-line px-2 py-1 hover:border-ink hover:text-ink"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Scroll timeline forward"
            className="border border-line px-2 py-1 hover:border-ink hover:text-ink"
          >
            →
          </button>
        </span>
      </div>
      <div
        ref={trackRef}
        onScroll={(event) => { if (!timeline) return; const el = event.currentTarget; const max = el.scrollWidth - el.clientWidth; setPosition(max > 0 ? Math.round(el.scrollLeft / max * Math.max(0, models.length - 1)) : 0); }}
        className="scrollbar-none flex snap-x gap-6 overflow-x-auto px-1 pt-6 pb-6"
      >
        {models.map((m, i) => {
          const active = selected === m.m;
          const frame = (
            <>
              {art?.[m.m] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={art[m.m]}
                  alt=""
                  loading="lazy"
                  className={cn("aspect-[4/3] w-full object-cover", !timeline && "border")}
                />
              ) : (
                <VespaLineArt
                  className={cn(
                    "px-6 py-8", !timeline && "border",
                    active ? "text-rosso" : "text-ink",
                  )}
                />
              )}
              <span className="mt-3 flex items-baseline gap-2 border-t-2 border-ink pt-2">
                <span
                  className={cn(
                    "font-grotesk shrink-0 text-2xl font-black tracking-tight whitespace-nowrap",
                    active && "text-rosso",
                  )}
                >
                  {shortYear(m.y)}
                </span>
                <span className="text-[15px] leading-snug font-semibold">
                  {m.m}
                </span>
              </span>
              <span className="mt-1 block font-mono text-[11px] tracking-wide text-zinc-600 uppercase">
                {m.engine}
              </span>
              {active && (
                <span className="mt-2 block font-mono text-[11px] tracking-[0.1em] text-rosso">
                  RECORD OPEN
                </span>
              )}
            </>
          );
          const cls = cn(
            timeline ? "w-[min(78vw,430px)] shrink-0 snap-start text-left" : "w-[280px] shrink-0 snap-start text-left transition-colors motion-reduce:transition-none",
            active && "[&>span:first-of-type]:border-rosso",
          );
          return link ? (
            <Link
              key={m.m}
              id={`frieze-item-${i}`}
              href={href(m.m)}
              className={cn(cls, "group")}
              aria-label={`Open ${m.m}`}
            >
              {frame}
            </Link>
          ) : (
            <button
              key={m.m}
              id={`frieze-item-${i}`}
              type="button"
              onClick={() => onSelect?.(m.m)}
              aria-pressed={active}
              className={cn(cls, "cursor-pointer")}
            >
              {frame}
            </button>
          );
        })}
      </div>
      {timeline && models.length > 1 && <div className="mx-auto max-w-6xl px-1 pb-5">
        <div className="flex items-baseline justify-between gap-3 text-xs text-zinc-600"><span>EXPLORE BY YEAR</span><span>{models[position]?.y} · {models[position]?.m}</span></div>
        <input type="range" min={0} max={models.length - 1} step={1} value={position} aria-label="Scroll through scooter milestones" aria-valuetext={`${models[position]?.y} ${models[position]?.m}`} className="mt-3 w-full accent-zinc-900" onChange={event => { const i = Number(event.target.value); setPosition(i); const el = trackRef.current; if (el) el.scrollTo({left: (el.scrollWidth - el.clientWidth) * i / (models.length - 1), behavior: "auto"}); }}/>
        <div className="mt-1 flex gap-4 overflow-x-auto pb-1" aria-label="Jump to a milestone">{models.map((model, i) => <button key={model.m} type="button" aria-label={`Show ${model.m}, ${model.y}`} aria-current={position === i ? "true" : undefined} onClick={() => { const el = trackRef.current; if (el) el.scrollTo({left: (el.scrollWidth - el.clientWidth) * i / (models.length - 1), behavior: "smooth"}); setPosition(i); }} className={cn("shrink-0 border-t pt-2 text-xs", position === i ? "border-ink font-semibold text-ink" : "border-zinc-300 text-zinc-500")}>{shortYear(model.y)}</button>)}</div>
      </div>}
    </div>
  );
}
