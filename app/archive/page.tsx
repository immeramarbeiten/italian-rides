import { Suspense } from "react";
import Link from "next/link";
import { ArchiveExplorer } from "@/components/archive-explorer";
import { VESPA_MODELS } from "@/lib/vespa-data";

export const metadata = { title: "Archive — Italian Rides" };

export default function ArchivePage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        THE ARCHIVE
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight sm:text-5xl">
        A history of moving things.
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        {VESPA_MODELS.length} documented Vespa milestones, 1946–2018 — every
        one photographed, specified from public sources, and linked to its
        components. Peugeot, Lambretta and Yamaha join after launch.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={
            <p className="font-mono text-sm text-zinc-500">
              Loading the archive…
            </p>
          }
        >
          <ArchiveExplorer />
        </Suspense>
      </div>
      <p className="mt-10 border-t border-line pt-4 text-sm text-zinc-600">
        Spotted an error? Read{" "}
        <Link href="/methodology" className="underline underline-offset-2 hover:text-rosso">
          how the archive is researched
        </Link>{" "}
        and how to send a correction.
      </p>
    </div>
  );
}
