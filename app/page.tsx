import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimateIn } from "@/components/animate-in";
import { buttonVariants } from "@/components/ui/button";
import { Frieze } from "@/components/frieze";
import { FieldGuide } from "@/components/field-guide";
import { FRIEZE_ART } from "@/lib/frieze-art";

const JOURNEYS = [
  {
    href: "/timeline",
    verb: "Discover",
    blurb: "Explore twelve milestones and their stories, 1946 to 2018.",
  },
  {
    href: "/models/vespa-gts-granturismo#field-guide",
    verb: "Understand",
    blurb: "See how a scooter and its systems work — every answer with its source.",
  },
  {
    href: "/garage",
    verb: "Keep",
    blurb: "Park your scooter, log the work, brief your workshop.",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="grid items-start gap-10 pt-14 lg:grid-cols-[1fr_1.5fr]">
        <AnimateIn className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
            AN AI FIELD MECHANIC ·{" "}
            <span className="whitespace-nowrap">BUILT ON META AI</span>
          </p>
          <h1 className="font-grotesk mt-4 max-w-md text-5xl leading-[1.02] font-black tracking-tight">
            Show it what&apos;s wrong.
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-zinc-600">
            Photo plus your words in — the agent looks, outlines, and zooms,
            then drafts the work to your scooter&apos;s passport. You confirm
            every step; nothing saves itself.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href="/inspect" className={buttonVariants({ size: "lg" })}>
              Inspect your scooter <ArrowRight />
            </Link>
            <Link
              href="/timeline"
              className="font-medium underline-offset-4 hover:text-rosso hover:underline"
            >
              Or explore the archive →
            </Link>
          </div>
        </AnimateIn>
        <AnimateIn className="min-w-0">
          <figure className="w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frieze/ill-vespa-gts.jpg"
              alt="Vespa GTS — studio illustration, side profile"
              className="aspect-[3/2] w-full border border-line object-cover"
            />
            <figcaption className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[11px] text-zinc-600">
              <span>Vespa GTS · studio illustration</span>
              <span>AI-generated plate</span>
            </figcaption>
          </figure>
        </AnimateIn>
      </div>

      <p className="mt-14 border-y border-line py-3 font-mono text-[11px] tracking-[0.1em] text-zinc-600">
        <Link href="/archive" className="hover:text-rosso hover:underline">
          12 DOCUMENTED MODELS · 1946–2018 · SOURCES ON EVERY RECORD →
        </Link>
      </p>

      <section className="mt-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-grotesk text-2xl font-bold tracking-tight">
            The bloodline
          </h2>
          <Link
            href="/timeline"
            className="inline-flex items-center gap-1 text-sm font-medium text-rosso hover:underline"
          >
            Full timeline <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="relative left-1/2 mt-2 w-screen max-w-none -translate-x-1/2">
          <div className="px-4 sm:px-6">
            <Frieze link art={FRIEZE_ART} />
          </div>
        </div>
      </section>

      <section className="mt-20">
        <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
          INSIDE THE MACHINE
        </p>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-grotesk max-w-xl text-3xl font-black tracking-tight">
            Select a system. Understand what it does. Follow the source.
          </h2>
          <Link
            href="/models/vespa-gts-granturismo#field-guide"
            className="inline-flex items-center gap-1 text-sm font-medium text-rosso hover:underline"
          >
            From machine to manual <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <p className="mt-3 max-w-2xl leading-relaxed text-zinc-600">
          Two GTS configurations, one documented fuel system — carburettor
          versus injection, straight from the workshop manuals. Switch the
          configuration and watch the answer change.
        </p>
        <div className="mt-6">
          <FieldGuide />
        </div>
        <p className="mt-3 font-mono text-[11px] text-zinc-600">
          GTS SUPER 125 I.E. → FUEL SYSTEM → WORKSHOP MANUAL, PDF PP. 8–9
        </p>
      </section>

      <section aria-label="Where to begin" className="mt-20">
        {JOURNEYS.map((j) => (
          <Link
            key={j.href}
            href={j.href}
            className="group flex items-baseline gap-5 border-t border-line py-5 last:border-b"
          >
            <span className="font-grotesk w-36 shrink-0 text-2xl font-black tracking-tight group-hover:text-rosso">
              {j.verb}
            </span>
            <span className="flex-1 text-zinc-600">{j.blurb}</span>
            <ArrowRight className="size-4 shrink-0 self-center text-rosso transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        ))}
      </section>
    </div>
  );
}
