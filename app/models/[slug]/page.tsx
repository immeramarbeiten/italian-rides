import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  ARCHIVE_MODELS,
  modelBySlug,
  neighbors,
} from "@/lib/models";
import {
  FRIEZE_ART,
  FRIEZE_CREDIT,
  FRIEZE_PHOTO,
  FRIEZE_SOURCE,
} from "@/lib/frieze-art";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { MODEL_ANATOMY } from "@/lib/model-anatomy";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { VespaLineArt } from "@/components/vespa-lineart";
import { buttonVariants } from "@/components/ui/button";
import { FigCaption } from "@/components/fig";
import { FieldGuide } from "@/components/field-guide";
import { SpecTableView } from "@/components/spec-table";
import { GS_MIX_TABLE } from "@/lib/spec-tables";
import { MODEL_CODES } from "@/lib/model-codes";
import {
  GTS125_CONSUMABLES,
  GTS125_SCHEDULE,
  GTS125_SOURCE,
} from "@/lib/service-schedule";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return ARCHIVE_MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = modelBySlug(slug);
  return { title: m ? `${m.m} — Italian Rides` : "Model — Italian Rides" };
}

const GLYPH = { fit: "text-verde", adapt: "text-ambra", no: "text-stone-300" } as const;
const MARK = { fit: "●", adapt: "◐", no: "○" } as const;

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = modelBySlug(slug);
  if (!m) notFound();
  const { prev, next } = neighbors(slug);
  const art = FRIEZE_ART[m.m];
  const photo = FRIEZE_PHOTO[m.m];
  const credit = FRIEZE_CREDIT[m.m];
  const modelIdx = ARCHIVE_MODELS.findIndex((x) => x.slug === slug);
  const recordNo = String(modelIdx + 1).padStart(3, "0");

  return (
    <div className="pt-10">
      <div className="flex items-baseline justify-between gap-4">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-zinc-600">
          <Link href="/archive" className="hover:text-rosso hover:underline">Archive</Link>
          {" / "}
          <Link href="/timeline" className="hover:text-rosso hover:underline">Timeline</Link>
          {" / "}
          <span className="text-ink">{m.m}</span>
        </nav>
        <span className="shrink-0 font-mono text-[11px] tracking-[0.1em] text-zinc-600">
          RECORD {recordNo}
        </span>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={art}
              alt={`${m.m} — studio illustration, side profile`}
              className="aspect-[3/2] w-full border border-line bg-white object-cover"
            />
          ) : (
            <div className="border border-line bg-white p-10">
              <VespaLineArt className="text-ink" />
            </div>
          )}
          <FigCaption no={1} className="mt-3">
            {art ? `${m.m} — studio illustration` : "Art pending"}
          </FigCaption>
          {photo && (
            <figure className="mt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`${m.m} — documentary photograph`}
                loading="lazy"
                className="aspect-[4/3] w-full border border-line bg-white object-cover"
              />
              <FigCaption no={2} className="mt-3">
                {m.m} — documentary photograph
              </FigCaption>
              {credit && (
                <p className="mt-2 font-mono text-[11px] text-zinc-500">
                  PHOTO ©{" "}
                  {FRIEZE_SOURCE[m.m] ? (
                    <a
                      href={FRIEZE_SOURCE[m.m]}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:text-rosso"
                    >
                      {credit} ↗
                    </a>
                  ) : (
                    credit
                  )}
                </p>
              )}
            </figure>
          )}
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
            VESPA · {m.decade.toUpperCase()} · {m.family.toUpperCase()}
          </p>
          <h1 className="font-grotesk mt-2 text-4xl font-black tracking-tight">
            {m.m}
          </h1>
          <p className="font-display mt-2 text-lg text-zinc-700 italic">
            {m.blurb}
          </p>
          <dl className="mt-4 space-y-2 border-y border-line py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[11px] text-zinc-500">PRODUCTION</dt>
              <dd className="font-medium">{m.y}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[11px] text-zinc-500">ENGINE</dt>
              <dd className="text-right font-medium">{m.engine}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[11px] text-zinc-500">BUILT</dt>
              <dd className="font-medium">{m.factory}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={slug === "vespa-gts-granturismo" ? "#field-guide" : "#anatomy"}
              className={cn(buttonVariants({}))}
            >
              Understand its systems <ArrowRight aria-hidden />
            </Link>
            <Link
              href={`/models/${slug}/viewer`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              View 3D model
            </Link>
          </div>
          <Link
            href={`/inspect?model=${encodeURIComponent(m.m)}`}
            className="mt-3 inline-block text-sm font-medium text-rosso underline underline-offset-2"
          >
            Identify parts from a photo →
          </Link>
          <details className="mt-4 border border-line bg-white text-sm">
            <summary className="cursor-pointer px-3 py-2 font-mono text-[11px] tracking-[0.08em] text-zinc-600">
              ABOUT THIS RECORD
            </summary>
            <div className="space-y-1.5 border-t border-line px-3 py-3 font-mono text-[11px] leading-relaxed text-zinc-600">
              <p>
                SCOPE —{" "}
                {m.m.includes("/")
                  ? "FAMILY OVERVIEW; SPECS SPAN VARIANTS"
                  : "ONE DOCUMENTED CONFIGURATION"}
              </p>
              <p>3D — ILLUSTRATIVE STUDY, NOT THIS EXACT VARIANT</p>
              <p>SRC — {m.src.join(" · ").toUpperCase()}</p>
            </div>
          </details>
        </div>
      </div>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">Profile</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-zinc-700">
            {m.prose}
          </p>
          <h3 className="font-grotesk mt-6 text-lg font-bold tracking-tight">
            Setup
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-zinc-700">
            {m.setup}
          </p>
        </div>
        <aside className="h-fit border border-zinc-300 border-l-2 border-l-rosso bg-white px-5 py-4">
          <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
            TELLING DETAIL
          </p>
          <p className="font-display mt-2 text-lg leading-snug text-ink italic">
            {m.anecdote}
          </p>
        </aside>
      </section>

      {MODEL_CODES[m.m] && (
        <section className="mt-14 max-w-2xl">
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">
            Numbers & codes
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-zinc-700">
            {MODEL_CODES[m.m].text}
          </p>
          <p className="mt-2 font-mono text-[11px] text-zinc-400">
            SRC — {MODEL_CODES[m.m].src.join(" · ")}
          </p>
        </section>
      )}

      {slug === "vespa-150-gs-gran-sport" && (
        <section className="mt-14 max-w-2xl">
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">
            Fuel mix
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Values with their conditions — the manual gives a table, not a
            number.
          </p>
          <div className="mt-4">
            <SpecTableView table={GS_MIX_TABLE} />
          </div>
        </section>
      )}

      {slug === "vespa-gts-granturismo" && (
        <section id="field-guide" className="mt-14 scroll-mt-24">
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">
            Inside the Vespa
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Pick a documented configuration, then a system. Similar names,
            different machines — the diagram changes with the evidence.
          </p>
          <div className="mt-4">
            <FieldGuide />
          </div>
        </section>
      )}

      {slug === "vespa-gts-granturismo" && (
        <section className="mt-14">
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">
            Service schedule — GTS 125
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Factory intervals for the 125 exactly — not the 250/300.
          </p>
          <ul className="mt-4 space-y-2">
            {GTS125_SCHEDULE.map((row) => (
              <li
                key={row.interval}
                className="border border-line bg-white px-4 py-3 text-sm"
              >
                <p className="font-grotesk font-bold">{row.interval}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-zinc-600">
                  {row.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <h3 className="font-grotesk mt-6 text-lg font-bold tracking-tight">
            Fluids, pressures & consumables
          </h3>
          <dl className="mt-2 divide-y divide-line border border-line bg-white text-sm">
            {GTS125_CONSUMABLES.map((c) => (
              <div key={c.item} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[220px_1fr]">
                <dt className="font-medium">{c.item}</dt>
                <dd className="text-zinc-600">{c.spec}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 font-mono text-[11px] text-zinc-400">
            SRC — {GTS125_SOURCE.toUpperCase()}
          </p>
        </section>
      )}

      <section id="anatomy" className="mt-14 scroll-mt-24">
        <h2 className="font-grotesk text-2xl font-bold tracking-tight">Anatomy</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Six assemblies, described for this machine. Pick one for the
          general primer plus what makes this model&apos;s version distinct.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VESPA_PARTS.map((p, i) => (
            <Link
              key={p.id}
              href={`/models/${slug}/components/${p.id}`}
              className="group flex items-start gap-3 border border-line bg-white p-4 transition-colors hover:border-ink"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center bg-zinc-100 font-mono text-xs group-hover:bg-rosso group-hover:text-white">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{p.label}</span>
                <span className="mt-0.5 line-clamp-2 block text-sm text-zinc-500">
                  {MODEL_ANATOMY[slug]?.[p.id] ?? p.note}
                </span>
              </span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-rosso" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">
            Parts compatibility
          </h2>
          <Link href="/parts#fitment" className="text-sm font-medium text-rosso hover:underline">
            Full fitment matrix →
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line border border-line bg-white">
          {CATALOG_PARTS.map((p) => {
            const cell = p.fitment[modelIdx];
            return (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                <span className={cn("font-mono text-sm", GLYPH[cell.fit])} aria-hidden>
                  {MARK[cell.fit]}
                </span>
                <span className="w-24 shrink-0 font-mono text-[11px] text-zinc-500">
                  {cell.fit === "fit"
                    ? "FITS"
                    : cell.fit === "adapt"
                      ? "ADAPTS"
                      : "DOES NOT FIT"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.item}</span>
                  {cell.note && (
                    <span className="block truncate text-xs text-zinc-500">{cell.note}</span>
                  )}
                </span>
                <Link
                  href={`/models/${slug}/components/${p.id}`}
                  className="shrink-0 font-mono text-xs text-rosso hover:underline"
                >
                  Details
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 font-mono text-[11px] text-zinc-500">
          ILLUSTRATIVE FITMENT — CONFIRM AGAINST FRAME NUMBER + PARTS BOOK
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-grotesk text-2xl font-bold tracking-tight">Bloodline</h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">{m.facts}</p>
        <p className="mt-1 font-mono text-[11px] text-zinc-400">
          CHRONOLOGICAL NEIGHBOURS IN THE ARCHIVE — NOT NECESSARILY DIRECT
          PREDECESSORS.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/models/${prev.slug}`}
              className="flex items-center gap-3 border border-line bg-white p-4 hover:border-ink"
            >
              <ArrowLeft className="size-4 shrink-0 text-rosso" />
              <span>
                <span className="block font-mono text-[11px] text-zinc-500">PREVIOUS · {prev.y}</span>
                <span className="block font-medium">{prev.m}</span>
              </span>
            </Link>
          ) : (
            <span className="border border-dashed border-line p-4 font-mono text-xs text-zinc-400">
              First of the line — it starts here.
            </span>
          )}
          {next ? (
            <Link
              href={`/models/${next.slug}`}
              className="flex items-center gap-3 border border-line bg-white p-4 text-right hover:border-ink"
            >
              <span className="flex-1">
                <span className="block font-mono text-[11px] text-zinc-500">NEXT · {next.y}</span>
                <span className="block font-medium">{next.m}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-rosso" />
            </Link>
          ) : (
            <span className="border border-dashed border-line p-4 font-mono text-xs text-zinc-400">
              Latest documented milestone.
            </span>
          )}
        </div>
        <p className="mt-4 font-mono text-[11px] text-zinc-400">
          SRC — {m.src.join(" · ")}
        </p>
      </section>
    </div>
  );
}
