import Link from "next/link";
import { DemoNext } from "@/components/demo-next";
import { FitmentMatrix } from "@/components/fitment-matrix";
import { MaintenanceGuides } from "@/components/maintenance-guides";

export const metadata = { title: "Parts — Italian Rides" };

export default function PartsPage() {
  return (
    <div className="pt-10 pb-16">
      <h1 className="font-display text-4xl tracking-tight">Parts</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Check a part against the fitment matrix, then follow a guided job.
        To identify a part from a photograph,{" "}
        <Link href="/inspect" className="underline underline-offset-2 hover:text-rosso">
          inspect your scooter
        </Link>{" "}
        instead — every result links back here.
      </p>

      <section aria-labelledby="fitment" className="mt-12">
        <h2 id="fitment" className="font-display text-2xl tracking-tight">
          1. Fitment matrix
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Catalog part × model, with fit status, notes and source labels.
          Illustrative data compiled from public catalogue patterns.
        </p>
        <div className="mt-4">
          <FitmentMatrix />
        </div>
      </section>

      <section aria-labelledby="guides" className="mt-12">
        <h2 id="guides" className="font-display text-2xl tracking-tight">
          2. Guided maintenance
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          One job per assembly: checklist steps, tools and torque notes.
          Illustrative procedures — confirm values against the workshop
          manual for your exact variant.
        </p>
        <div className="mt-4">
          <MaintenanceGuides />
        </div>
      </section>

      <DemoNext
        href="/garage"
        step="4 / 6"
        title="Park it in your garage"
        blurb="Your scooters, mileage and service history in this browser."
      />
    </div>
  );
}
