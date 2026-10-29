import { DiagnoseFinder } from "@/components/diagnose-finder";

export const metadata = { title: "Diagnose — Italian Rides" };

export default function DiagnosePage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        DIAGNOSE — SYMPTOM TO FIX
      </p>
      <h1 className="font-grotesk mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        What&apos;s it doing?
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Pick your scooter, describe the symptom, answer what you observe.
        Possible causes come with their sources — and historical procedures
        stay in the archive, clearly labeled, never guided.
      </p>
      <p className="mt-4 border border-dashed border-line bg-white px-4 py-3 font-mono text-[11px] text-zinc-500">
        SCOPE: CLASSIC TWO-STROKES (GS 150, P200 MANUALS). MODERN INJECTION,
        CVT AND ABS FAULTS ARRIVE WITH MODERN MANUAL SOURCING — NOTHING HERE
        APPLIES TO THEM. FACTS ONLY, NO SCANS SHIPPED.
      </p>
      <div className="mt-8">
        <DiagnoseFinder />
      </div>
    </div>
  );
}
