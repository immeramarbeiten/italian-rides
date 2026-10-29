"use client";

import { useRef } from "react";
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
}) {
  const trackRef = useRef<HTMLDivElement>(null);
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
                  className="aspect-[4/3] w-full border object-cover"
                />
              ) : (
                <VespaLineArt
                  className={cn(
                    "border px-6 py-8",
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
            "w-[280px] shrink-0 snap-start text-left transition-colors motion-reduce:transition-none",
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
    </div>
  );
}
