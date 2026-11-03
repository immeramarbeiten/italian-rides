"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useGarage } from "@/lib/store";
import { ARCHIVE_MODELS } from "@/lib/models";
import {
  FRIEZE_PHOTO,
  FRIEZE_CREDIT,
  FRIEZE_SOURCE,
} from "@/lib/frieze-art";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VehiclePassport({ vehicleId }: { vehicleId: string }) {
  const scooters = useGarage((s) => s.scooters);
  const serviceLog = useGarage((s) => s.serviceLog);
  const v = scooters.find((s) => s.id === vehicleId);

  if (!v) {
    return (
      <div className="border border-dashed border-line px-6 py-12 text-center">
        <p className="font-grotesk text-2xl font-bold">No such scooter here.</p>
        <p className="mt-2 text-sm text-zinc-600">
          It may have been removed — garage data lives in this browser only.
        </p>
        <Link href="/garage" className={cn(buttonVariants({}), "mt-5")}>
          Back to the garage
        </Link>
      </div>
    );
  }

  const slug = ARCHIVE_MODELS.find((m) => m.m === v.model)?.slug;
  // A family match is a reference image, not identification of this scooter.
  const referenceModel = FRIEZE_PHOTO[v.model] ? v.model : /\b(?:vespa\s+)?gts\b/i.test(v.model) ? "Vespa GTS/Granturismo" : null;
  const photo = referenceModel ? FRIEZE_PHOTO[referenceModel] : null;
  const credit = referenceModel ? FRIEZE_CREDIT[referenceModel] : null;
  const source = referenceModel ? FRIEZE_SOURCE[referenceModel] : null;
  const events = serviceLog.filter((e) => e.scooterId === v.id);

  return (
    <div>
      <Link
        href="/garage"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-rosso hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> GARAGE
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {photo ? (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`${referenceModel} reference photograph`} className="aspect-[4/3] w-full bg-zinc-100 object-cover" />
              <figcaption className="mt-2 text-xs text-zinc-600">
                {referenceModel === "Vespa GTS/Granturismo" ? "GTS 300 reference photo; your scooter may differ." : "Reference photo; your scooter may differ."}{" "}
                {credit && source && <a href={source} className="underline" target="_blank" rel="noreferrer">{credit} ↗</a>}
              </figcaption>
            </figure>
          ) : (
            <div className="flex aspect-[4/3] flex-col justify-end bg-zinc-100 p-8">
              <p className="text-xs uppercase tracking-widest text-zinc-500">Your garage</p>
              <p className="mt-2 text-2xl font-semibold">{v.model}</p>
              <p className="mt-1 text-sm text-zinc-600">No reference photograph available yet.</p>
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Owner-reported</Badge>
            <Badge variant="outline">Private — this browser only</Badge>
          </div>
          <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight">
            {v.model}
          </h1>
          <dl className="mt-4 space-y-2 border-y border-line py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[11px] text-zinc-500">BUILD YEAR</dt>
              <dd className="font-medium tabular-nums">{v.year}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-mono text-[11px] text-zinc-500">MILEAGE</dt>
              <dd className="font-medium tabular-nums">
                {v.mileage.toLocaleString()} km
              </dd>
            </div>
            {v.notes && (
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[11px] text-zinc-500">NOTES</dt>
                <dd className="text-right font-medium">{v.notes}</dd>
              </div>
            )}
          </dl>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href={`/garage/${v.id}/service/new`}
              className={cn(buttonVariants({}), "w-full")}
            >
              <Plus aria-hidden /> Add maintenance record
            </Link>
            <Link
              href={`/inspect?model=${encodeURIComponent(v.model)}`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Inspect a component <ArrowRight aria-hidden />
            </Link>
            {slug && (
              <Link
                href={`/models/${slug}`}
                className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
              >
                Explore the model
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-grotesk text-2xl font-bold tracking-tight">
          Maintenance timeline ({events.length})
        </h2>
        {events.length === 0 ? (
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            No history yet — every scooter starts somewhere. Log the first
            oil change and this page becomes its memory.
          </p>
        ) : (
          <ol className="mt-4 space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border border-line bg-white px-4 py-3 text-sm"
              >
                <span className="font-mono text-xs text-zinc-500 tabular-nums">
                  {e.date} · {e.mileage.toLocaleString()} KM
                </span>
                <span className="w-full sm:w-auto sm:flex-1">{e.entry}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="border border-dashed border-line px-4 py-4">
          <p className="font-grotesk font-bold">Installed parts</p>
          <p className="mt-1 text-sm text-zinc-500">
            Original vs replacement tracking arrives with part numbers.
          </p>
        </div>
        <div className="border border-dashed border-line px-4 py-4">
          <p className="font-grotesk font-bold">Documentation</p>
          <p className="mt-1 text-sm text-zinc-500">
            Manuals, invoices and restoration photos arrive next.
          </p>
        </div>
      </section>
    </div>
  );
}
