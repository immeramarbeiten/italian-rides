import { Suspense } from "react";
import { InspectEntry } from "@/components/inspect-entry";

export const metadata = { title: "Inspect — Italian Rides" };

export default function InspectPage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
        UNDERSTAND YOUR SCOOTER
      </p>
      <h1 className="font-grotesk mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Understand a component.
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Choose a part of the scooter to explore, and add your own photo to
        compare. The photo is identified automatically — every call shows
        its confidence, and you confirm.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={
            <p className="font-mono text-sm text-zinc-500">Loading…</p>
          }
        >
          <InspectEntry />
        </Suspense>
      </div>
    </div>
  );
}
