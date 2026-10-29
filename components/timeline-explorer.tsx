"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { VESPA_MODELS } from "@/lib/vespa-data";
import { FRIEZE_ART } from "@/lib/frieze-art";
import { slugify } from "@/lib/models";
import { buttonVariants } from "@/components/ui/button";
import { VespaLineArt } from "@/components/vespa-lineart";
import { Frieze } from "@/components/frieze";
import { YearScrubber } from "@/components/year-scrubber";
import { cn } from "@/lib/utils";

function yearNum(y: string): number {
  return parseInt(y.match(/\d{4}/)?.[0] ?? "0", 10);
}

export function TimelineExplorer() {
  const [selectedName, setSelectedName] = useState<string>(VESPA_MODELS[0].m);
  const selected =
    VESPA_MODELS.find((m) => m.m === selectedName) ?? VESPA_MODELS[0];
  const idx = VESPA_MODELS.indexOf(selected);

  function scrollStripTo(name: string) {
    const i = VESPA_MODELS.findIndex((m) => m.m === name);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`frieze-item-${i}`)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  // Year, strip and hero always describe the same machine.
  useEffect(() => {
    scrollStripTo(selected.m);
  }, [selected.m]);

  function pickYear(year: number) {
    let best = VESPA_MODELS[0];
    for (const m of VESPA_MODELS) {
      if (Math.abs(yearNum(m.y) - year) < Math.abs(yearNum(best.y) - year)) {
        best = m;
      }
    }
    setSelectedName(best.m);
  }

  const sheetArt = FRIEZE_ART[selected.m];

  return (
    <div>
      <YearScrubber
        models={VESPA_MODELS}
        selected={selected}
        onYear={pickYear}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={selected.m}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-8 grid gap-0 border border-zinc-300 bg-white lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="flex flex-col p-6 sm:p-8">
            <p className="flex items-baseline justify-between font-mono text-xs text-zinc-600">
              <span>{selected.y}</span>
              <span>
                {String(idx + 1).padStart(2, "0")} /{" "}
                {String(VESPA_MODELS.length).padStart(2, "0")}
              </span>
            </p>
            <h2 className="font-grotesk mt-3 text-4xl font-bold tracking-tight">
              {selected.m}
            </h2>
            <p className="font-display mt-2 text-lg leading-snug text-zinc-700 italic">
              {selected.blurb}
            </p>
            <dl className="mt-5 grid gap-4 border-y border-zinc-200 py-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] tracking-[0.1em] text-zinc-600">
                  ENGINE
                </dt>
                <dd className="mt-1 leading-snug font-medium">
                  {selected.engine}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-[0.1em] text-zinc-600">
                  BUILT
                </dt>
                <dd className="mt-1 leading-snug font-medium">
                  {selected.factory}
                </dd>
              </div>
            </dl>
            <div className="mt-5">
              <Link
                href={`/models/${slugify(selected.m)}`}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Explore this model
                <ArrowRight aria-hidden />
              </Link>
            </div>
            <div className="mt-auto flex items-center gap-2 pt-6">
              <button
                type="button"
                onClick={() =>
                  idx > 0 && setSelectedName(VESPA_MODELS[idx - 1].m)
                }
                disabled={idx === 0}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <ArrowLeft aria-hidden /> Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  idx < VESPA_MODELS.length - 1 &&
                  setSelectedName(VESPA_MODELS[idx + 1].m)
                }
                disabled={idx === VESPA_MODELS.length - 1}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Next <ArrowRight aria-hidden />
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-zinc-200 bg-zinc-100 p-6 sm:p-8 lg:border-t-0 lg:border-l">
            {sheetArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sheetArt}
                alt={`${selected.m} — archive photograph`}
                className="aspect-[4/3] w-full border border-zinc-300 bg-white object-cover"
              />
            ) : (
              <div className="border border-zinc-300 bg-white p-10">
                <VespaLineArt className="text-ink" />
              </div>
            )}
            <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-zinc-600">
              {sheetArt
                ? `FIG. 1 — ${selected.m.toUpperCase()}, STUDIO ILLUSTRATION`
                : "FIG. 1 — ART PENDING"}
            </p>
          </div>
        </motion.article>
      </AnimatePresence>

      <p className="mt-6 text-xs text-zinc-600">
        Sources: {selected.src.join(" · ")}
      </p>

      <div className="relative left-1/2 mt-6 w-screen max-w-none -translate-x-1/2">
        <div className="px-4 sm:px-6">
          <Frieze
            models={VESPA_MODELS}
            selected={selected.m}
            onSelect={setSelectedName}
            art={FRIEZE_ART}
          />
        </div>
      </div>
    </div>
  );
}
