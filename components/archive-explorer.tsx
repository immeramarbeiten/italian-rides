"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ARCHIVE_MODELS,
  CATEGORIES,
  DECADES,
  ENGINE_TYPES,
  FAMILIES,
  type ArchiveModel,
} from "@/lib/models";
import { FRIEZE_ART } from "@/lib/frieze-art";
import { Frieze } from "@/components/frieze";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ModelCard({ m }: { m: ArchiveModel }) {
  return (
    <Link
      href={`/models/${m.slug}`}
      className="group block border border-line bg-white pb-4 shadow-[0_10px_28px_rgba(60,45,20,0.08)] transition-colors hover:border-ink"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {FRIEZE_ART[m.m] ? (
        <img
          src={FRIEZE_ART[m.m]}
          alt=""
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-zinc-100 font-mono text-xs text-zinc-500">
          NO IMAGE YET
        </div>
      )}
      <span className="block px-4 pt-3 font-mono text-[11px] tracking-[0.1em] text-zinc-500">
        {m.y} · VESPA
      </span>
      <span className="font-grotesk block px-4 text-lg leading-tight font-bold">
        {m.m}
      </span>
      <span className="mt-1 line-clamp-2 block px-4 text-sm text-zinc-600">
        {m.blurb}
      </span>
      <span className="mt-2 block px-4 font-mono text-[11px] text-zinc-500 uppercase">
        {m.engine}
      </span>
    </Link>
  );
}

const selectCls =
  "w-full border border-line bg-white px-3 py-2 text-sm focus:border-rosso focus:outline-none";

export function ArchiveExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [decade, setDecade] = useState(params.get("decade") ?? "All");
  const [family, setFamily] = useState(params.get("family") ?? "All");
  const [engine, setEngine] = useState(params.get("engine") ?? "All");
  const [category, setCategory] = useState(params.get("category") ?? "All");
  const [mode, setMode] = useState(
    params.get("mode") === "timeline" ? "timeline" : "collection",
  );

  function sync(next: Record<string, string>, keepScroll = false) {
    const y = keepScroll ? window.scrollY : 0;
    const sp = new URLSearchParams();
    const all = { q, decade, family, engine, category, mode, ...next };
    for (const [k, v] of Object.entries(all)) {
      if (v && v !== "All" && !(k === "mode" && v === "collection")) {
        sp.set(k, v);
      }
    }
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    if (keepScroll) requestAnimationFrame(() => window.scrollTo(0, y));
  }

  function setModeKeep(m: string) {
    setMode(m);
    sync({ mode: m }, true);
  }

  function reset() {
    setQ("");
    setDecade("All");
    setFamily("All");
    setEngine("All");
    setCategory("All");
    setMode("collection");
    router.replace(pathname, { scroll: false });
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ARCHIVE_MODELS.filter((m) => {
      if (decade !== "All" && m.decade !== decade) return false;
      if (family !== "All" && m.family !== family) return false;
      if (engine !== "All" && m.engineType !== engine) return false;
      if (category !== "All" && m.category !== category) return false;
      if (!needle) return true;
      return `${m.m} ${m.engine} ${m.facts} ${m.y}`
        .toLowerCase()
        .includes(needle);
    });
  }, [q, decade, family, engine, category]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/timeline" className={cn(buttonVariants({ size: "sm" }))}>
          Vespa
        </Link>
        {["Peugeot", "Lambretta", "Yamaha"].map((b) => (
          <span
            key={b}
            title="Coming to the archive after launch"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "cursor-not-allowed opacity-50",
            )}
            aria-disabled="true"
          >
            {b} · soon
          </span>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <label className="block text-sm">
          <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">
            SEARCH
          </span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              sync({ q: e.target.value });
            }}
            placeholder="PX, Primavera, 2-stroke…"
            className={`${selectCls} mt-1`}
            type="search"
            aria-label="Search models"
          />
        </label>
        <label className="block text-sm">
          <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">
            DECADE
          </span>
          <select
            value={decade}
            onChange={(e) => {
              setDecade(e.target.value);
              sync({ decade: e.target.value });
            }}
            className={`${selectCls} mt-1`}
          >
            <option>All</option>
            {DECADES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">
            FAMILY
          </span>
          <select
            value={family}
            onChange={(e) => {
              setFamily(e.target.value);
              sync({ family: e.target.value });
            }}
            className={`${selectCls} mt-1`}
          >
            <option>All</option>
            {FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">
            ENGINE
          </span>
          <select
            value={engine}
            onChange={(e) => {
              setEngine(e.target.value);
              sync({ engine: e.target.value });
            }}
            className={`${selectCls} mt-1`}
          >
            <option>All</option>
            {ENGINE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">
            CATEGORY
          </span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              sync({ category: e.target.value });
            }}
            className={`${selectCls} mt-1`}
          >
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Display mode">
          {(["collection", "timeline"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModeKeep(m)}
              aria-pressed={mode === m}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: mode === m ? "default" : "outline",
                }),
                "capitalize",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-zinc-500" aria-live="polite">
          SHOWING {filtered.length} OF {ARCHIVE_MODELS.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 border border-dashed border-line px-4 py-10 text-center">
          <p className="font-grotesk text-xl font-bold">No models match.</p>
          <p className="mt-1 text-sm text-zinc-600">
            Try a shorter term or clear a filter.
          </p>
          <button
            type="button"
            onClick={reset}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-4")}
          >
            Clear filters
          </button>
        </div>
      ) : mode === "collection" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <ModelCard key={m.slug} m={m} />
          ))}
        </div>
      ) : (
        <div className="relative left-1/2 mt-6 w-screen max-w-none -translate-x-1/2">
          <div className="px-4 sm:px-6">
            <Frieze
              models={filtered}
              link
              art={FRIEZE_ART}
            />
          </div>
        </div>
      )}
    </div>
  );
}
