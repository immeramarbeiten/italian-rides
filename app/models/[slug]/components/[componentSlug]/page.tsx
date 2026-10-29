import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ARCHIVE_MODELS, modelBySlug, modelIndexByName } from "@/lib/models";
import { FRIEZE_ART } from "@/lib/frieze-art";
import { VESPA_PARTS, type VespaPartId } from "@/lib/vespa-inspect";
import { COMPONENT_INFO } from "@/lib/component-info";
import { MODEL_ANATOMY } from "@/lib/model-anatomy";
import { COMPONENTS } from "@/lib/knowledge/components";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { VespaLineArt } from "@/components/vespa-lineart";
import { cn } from "@/lib/utils";

const IDS = VESPA_PARTS.map((p) => p.id);

export function generateStaticParams() {
  return ARCHIVE_MODELS.flatMap((m) =>
    IDS.map((componentSlug) => ({ slug: m.slug, componentSlug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; componentSlug: string }>;
}) {
  const { slug, componentSlug } = await params;
  const m = modelBySlug(slug);
  const p = VESPA_PARTS.find((x) => x.id === componentSlug);
  return {
    title: m && p ? `${p.label} · ${m.m} — Italian Rides` : "Component — Italian Rides",
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string; componentSlug: string }>;
}) {
  const { slug, componentSlug } = await params;
  const m = modelBySlug(slug);
  const part = VESPA_PARTS.find((p) => p.id === componentSlug);
  if (!m || !part) notFound();
  const info = COMPONENT_INFO[part.id];
  const modelNote = MODEL_ANATOMY[slug]?.[part.id];
  const catalog = CATALOG_PARTS.find((c) => c.id === part.id);
  const modelIdx = modelIndexByName(m.m);
  const cell = catalog?.fitment[modelIdx];
  const art = FRIEZE_ART[m.m];
  const others = VESPA_PARTS.filter((p) => p.id !== part.id);
  const names = COMPONENTS.find((c) => c.canonicalPart === part.id)?.names;

  return (
    <div className="pt-10">
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-zinc-500">
        <Link href="/archive" className="hover:text-rosso hover:underline">Archive</Link>
        {" / "}
        <Link href={`/models/${slug}`} className="hover:text-rosso hover:underline">{m.m}</Link>
        {" / "}
        <span className="text-ink">{part.label}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{info.assembly}</Badge>
        <Badge variant="outline">id: {part.id}</Badge>
        <Badge variant="outline">Editorial description</Badge>
      </div>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight">
        {part.label}
        <span className="text-rosso"> · {m.m}</span>
      </h1>
      {names && (
        <p className="mt-2 font-mono text-xs text-zinc-500">
          {names.de.toUpperCase()} · {names.it.toUpperCase()}
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={art}
              alt={`${m.m} — studio illustration`}
              className="aspect-[4/3] w-full border border-line bg-white object-cover"
            />
          ) : (
            <div className="border border-line bg-white p-10">
              <VespaLineArt className="text-ink" />
            </div>
          )}
          <p className="mt-2 font-mono text-[11px] text-zinc-500">
            LOCATION — {info.location.toUpperCase()}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={`/models/${slug}/viewer?component=${part.id}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              See it in 3D
            </Link>
            <Link
              href={`/inspect?model=${encodeURIComponent(m.m)}&part=${part.id}`}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              Find this on my scooter <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
        <div>
          <h2 className="font-grotesk text-xl font-bold">What it does</h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-zinc-700">
            {info.function}
          </p>
          {modelNote && (
            <div className="mt-3 border border-zinc-300 border-l-2 border-l-rosso bg-white px-4 py-3">
              <p className="font-mono text-[11px] tracking-[0.1em] text-zinc-600">
                ON THIS MODEL
              </p>
              <p className="mt-1 text-[15px] leading-[1.7] text-zinc-700">
                {modelNote}
              </p>
            </div>
          )}
          <h2 className="font-grotesk mt-8 text-xl font-bold">
            Part compatibility
          </h2>
          {catalog && cell ? (
            <div className="mt-3 border border-line bg-white p-5">
              <p className="font-medium">{catalog.item}</p>
              <p className="mt-1 font-mono text-sm">
                {cell.fit === "fit" && <span className="text-verde">● FITS</span>}
                {cell.fit === "adapt" && <span className="text-ambra">◐ ADAPTS</span>}
                {cell.fit === "no" && <span className="text-stone-400">○ NO FIT</span>}
                {cell.note && <span className="text-zinc-600"> — {cell.note}</span>}
              </p>
              <p className="mt-2 text-sm text-zinc-600">{catalog.blurb}</p>
              <p className="mt-2 font-mono text-[11px] text-zinc-500">
                SRC — {catalog.sources.join(" · ")}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">
              No catalog reference documented for this combination yet.
            </p>
          )}
          <div className="mt-4 border border-zinc-300 bg-white p-4 text-sm">
            <p className="font-medium">
              A component category is not a replacement-part SKU.
            </p>
            <p className="mt-1 text-zinc-600">
              “This appears to be a {part.label.toLowerCase()}” is an
              identification. “This exact replacement fits your scooter” needs a
              frame number and the parts book — always confirm both.
            </p>
          </div>
          <h2 className="font-grotesk mt-8 text-xl font-bold">
            Repairs & maintenance
          </h2>
          {catalog ? (
            <Link
              href={`/repairs/${part.id as string}`}
              className="mt-3 flex items-center justify-between gap-3 border border-line bg-white p-4 hover:border-ink"
            >
              <span>
                <span className="block font-medium">{catalog.guide.title}</span>
                <span className="block text-sm text-zinc-600">
                  {catalog.guide.steps.length} steps · {catalog.guide.tools.length} tools
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-rosso" />
            </Link>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">
              No procedure documented yet.
            </p>
          )}
          <h2 className="font-grotesk mt-8 text-xl font-bold">Related</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/models/${slug}/components/${o.id}`}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
              >
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
