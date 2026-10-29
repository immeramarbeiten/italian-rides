import Link from "next/link";
import { GLOSSARY } from "@/lib/glossary";

export const metadata = { title: "Glossary — Italian Rides" };

export default function GlossaryPage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        GLOSSARY
      </p>
      <h1 className="font-grotesk mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Workshop words, translated.
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        No scooter background needed. If a model page says a word you
        don&apos;t know, it should be on this list — plain definitions, no
        assumed knowledge.
      </p>
      <dl className="mt-8 grid gap-3 md:grid-cols-2">
        {GLOSSARY.map((g) => (
          <div key={g.term} className="border border-line bg-white p-5">
            <dt className="font-grotesk text-lg font-bold">{g.term}</dt>
            <dd className="mt-1 text-sm font-medium text-rosso">{g.short}</dd>
            <dd className="mt-2 text-sm leading-relaxed text-zinc-600">
              {g.detail}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm text-zinc-600">
        Ready for the machines?{" "}
        <Link href="/timeline" className="font-medium text-rosso underline underline-offset-2">
          Start the timeline
        </Link>
        .
      </p>
    </div>
  );
}
