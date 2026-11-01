import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Frieze } from "@/components/frieze";
import { GtsAssemblyExperience } from "@/components/gts-assembly-experience";
import { FRIEZE_ART } from "@/lib/frieze-art";

const JOURNEYS = [
  { number: "01", href: "/timeline", title: "Explore the archive", description: "Discover the machines and the stories behind them." },
  { number: "02", href: "/inspect", title: "Understand your scooter", description: "Start with a photo and explore the parts you can see." },
  { number: "03", href: "/garage", title: "Keep its story", description: "Bring your scooter, notes and work together in one place." },
];

export default function HomePage() {
  return <div>
    <section className="pt-12 sm:pt-16" aria-labelledby="home-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium tracking-[.14em] text-zinc-500">ITALIAN RIDES · A LIVING ARCHIVE</p>
        <h1 id="home-title" className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Know the machine.<br />Keep the story.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-600">Explore the history, understand the parts and get closer to the scooter you ride.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/inspect" className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700">Inspect your scooter <ArrowRight className="size-4" /></Link><Link href="/timeline" className="inline-flex items-center gap-2 border border-zinc-300 px-5 py-3 text-sm font-medium hover:border-ink">Explore the archive</Link></div>
      </div>
      <div className="relative left-1/2 mt-12 w-screen max-w-none -translate-x-1/2 px-4 sm:px-6"><Frieze link art={FRIEZE_ART} timeline/></div>
    </section>
    <section className="mt-16 border-t border-zinc-200 pt-10 sm:mt-24" aria-labelledby="machine-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-medium tracking-[.14em] text-zinc-500">A CLOSER LOOK</p><h2 id="machine-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Inside the machine.</h2><p className="mt-2 max-w-xl text-zinc-600">Explore an illustrated GTS 125 front assembly. Turn it around and separate the parts.</p></div><Link href="/models/vespa-gts-granturismo/viewer" className="text-sm font-medium underline underline-offset-4">Open the study →</Link></div>
      <GtsAssemblyExperience />
    </section>
    <section aria-label="Explore Italian Rides" className="mt-20 border-t border-zinc-200">
      {JOURNEYS.map(j=><Link key={j.href} href={j.href} className="group grid items-center gap-2 border-b border-zinc-200 py-6 sm:grid-cols-[3rem_1fr_1.3fr_auto]"><span className="text-xs text-zinc-500">{j.number}</span><h2 className="text-xl font-semibold">{j.title}</h2><p className="text-sm text-zinc-600">{j.description}</p><ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"/></Link>)}
    </section>
  </div>;
}
