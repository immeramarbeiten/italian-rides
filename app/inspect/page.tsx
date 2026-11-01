import { Suspense } from "react";
import { InspectEntry } from "@/components/inspect-entry";

export const metadata = { title: "Inspect — Italian Rides" };

export default function InspectPage() {
  return (
    <div className="pt-6">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
        UNDERSTAND YOUR SCOOTER
      </p>
      <h1 className="font-grotesk mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Understand your scooter.
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Start with a photo or explore the field guide. We’ll help you select a component and follow its sources.
      </p>
      <div className="mt-5">
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
