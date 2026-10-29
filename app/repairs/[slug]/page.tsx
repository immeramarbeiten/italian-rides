import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { ProcedureStepper } from "@/components/procedure-stepper";
import { Badge } from "@/components/ui/badge";

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
  return {
    title: c ? `${c.guide.title} — Italian Rides` : "Repair — Italian Rides",
  };
}

export default async function RepairPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = CATALOG_PARTS.find((c) => c.id === slug);
  if (!catalog) notFound();
  const part = VESPA_PARTS.find((p) => p.id === slug);
  const guide = catalog.guide;

  return (
    <div className="pt-10">
      <Link
        href="/parts"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-rosso hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> PARTS
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Illustrative procedure</Badge>
        <Badge variant="outline">PX pattern — confirm your variant</Badge>
        {part && <Badge variant="outline">{part.label}</Badge>}
      </div>
      <h1 className="font-grotesk mt-3 max-w-3xl text-4xl font-black tracking-tight">
        {guide.title}
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        {guide.steps.length} steps · {guide.tools.length} tools
        {guide.torque ? ` · torque spec included` : ""}
        {" "}— written as an orientation aid, not a workshop manual.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="border border-ambra/60 bg-white p-5 text-sm">
          <p className="font-grotesk font-bold">Before you pick up a wrench</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700">
            <li>
              For safety-critical work — brakes, steering, fuel, wheels — see
              a qualified mechanic unless a reviewed procedure says otherwise.
            </li>
            <li>
              Never trust torque values from memory. Check the manual for your
              exact variant.
            </li>
            <li>
              If a step doesn&apos;t match what you see, stop. Variants differ
              more than photos suggest.
            </li>
          </ul>
        </div>
        <div className="border border-line bg-white p-5 text-sm">
          <p className="font-grotesk font-bold">Required tools & parts</p>
          <ul className="mt-2 divide-y divide-line">
            {guide.tools.map((t) => (
              <li key={t} className="flex justify-between gap-3 py-1.5">
                <span>{t}</span>
                <span className="font-mono text-xs text-zinc-500">REQUIRED</span>
              </li>
            ))}
            {guide.torque && (
              <li className="flex justify-between gap-3 py-1.5">
                <span>Torque wrench — {guide.torque}</span>
                <span className="font-mono text-xs text-zinc-500">VERIFY</span>
              </li>
            )}
          </ul>
          <p className="mt-2 font-mono text-[11px] text-zinc-500">
            {catalog.item.toUpperCase()} — {catalog.blurb.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ProcedureStepper guide={guide} exitHref="/parts" />
      </div>

      <p className="mt-8 font-mono text-[11px] text-zinc-400">
        SRC — {catalog.sources.join(" · ")}
      </p>
      <div className="mt-2 flex flex-wrap gap-4 text-sm font-medium">
        <Link href={`/inspect?part=${slug}`} className="text-rosso underline underline-offset-2">
          Identify this on your scooter
        </Link>
        <Link href="/archive" className="text-rosso underline underline-offset-2">
          Browse the archive
        </Link>
      </div>
    </div>
  );
}
