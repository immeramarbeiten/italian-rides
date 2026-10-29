import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { VESPA_MODELS } from "@/lib/vespa-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GLYPH = { fit: "text-verde", adapt: "text-ambra", no: "text-stone-300" } as const;
const MARK = { fit: "●", adapt: "◐", no: "○" } as const;
const WORD = { fit: "FITS", adapt: "ADAPTS", no: "NO FIT" } as const;

export function generateStaticParams() {
  return CATALOG_PARTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = CATALOG_PARTS.find((x) => x.id === slug);
  return { title: c ? `${c.item} — Italian Rides` : "Part — Italian Rides" };
}

export default async function PartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = CATALOG_PARTS.find((c) => c.id === slug);
  if (!catalog) notFound();

  return (
    <div className="pt-10">
      <Link
        href="/parts"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-rosso hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> PARTS
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Illustrative fitment</Badge>
        <Badge variant="outline">OEM pattern — verify PN</Badge>
      </div>
      <h1 className="font-grotesk mt-3 max-w-3xl text-4xl font-black tracking-tight">
        {catalog.item}
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">{catalog.blurb}</p>

      <h2 className="font-grotesk mt-10 text-2xl font-bold tracking-tight">
        Compatibility evidence
      </h2>
      <ul className="mt-4 divide-y divide-line border border-line bg-white">
        {VESPA_MODELS.map((m, i) => {
          const cell = catalog.fitment[i];
          return (
            <li key={m.m} className="flex items-center gap-3 px-4 py-3">
              <span className={cn("font-mono text-sm", GLYPH[cell.fit])} aria-hidden>
                {MARK[cell.fit]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {m.m}{" "}
                  <span className="font-mono text-xs font-normal text-zinc-500">
                    {m.y} · {WORD[cell.fit]}
                  </span>
                </span>
                {cell.note && (
                  <span className="block truncate text-xs text-zinc-500">{cell.note}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 font-mono text-[11px] text-zinc-500">
        NO CLAIM OF COMPATIBILITY WITHOUT FRAME-NUMBER + PARTS-BOOK CONFIRMATION
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/repairs/${slug}`} className={cn(buttonVariants({}))}>
          Fitting procedure <ArrowRight aria-hidden />
        </Link>
        <Link
          href={`/inspect?part=${slug}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Identify on your scooter
        </Link>
      </div>
      <p className="mt-6 font-mono text-[11px] text-zinc-400">
        SRC — {catalog.sources.join(" · ")}
      </p>
    </div>
  );
}
