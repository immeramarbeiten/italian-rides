import Link from "next/link";
import { DemoNext } from "@/components/demo-next";
import { TimelineExplorer } from "@/components/timeline-explorer";

export const metadata = { title: "Timeline — Italian Rides" };

export default function TimelinePage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
        VESPA ARCHIVE
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        The timeline
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Twelve milestones, 1946 to the electric era. Move through time, then
        open a machine.
      </p>
      <details className="mt-4 max-w-2xl border border-zinc-300 bg-white text-sm">
        <summary className="cursor-pointer px-4 py-2.5 font-medium">
          New to Vespa?
        </summary>
        <p className="border-t border-zinc-200 px-4 py-3 leading-relaxed text-zinc-600">
          A Vespa is a steel-bodied scooter from Pontedera, Italy, built
          since 1946 — twist-grip gears on the classics, twist-and-go
          automatics on the moderns. Keep the{" "}
          <Link href="/glossary" className="font-medium text-rosso underline underline-offset-2">
            glossary
          </Link>{" "}
          open in another tab.
        </p>
      </details>
      <div className="mt-8">
        <TimelineExplorer />
      </div>
      <DemoNext
        href="/inspect"
        step="2 / 6"
        title="Understand a component"
        blurb="Pick an assembly, compare it with your own scooter."
      />
    </div>
  );
}
