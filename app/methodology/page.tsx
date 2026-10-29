import Link from "next/link";

export const metadata = { title: "Methodology — Italian Rides" };

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="font-grotesk text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-3 max-w-3xl space-y-3 text-[15px] leading-[1.7] text-zinc-700">
        {children}
      </div>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        METHODOLOGY
      </p>
      <h1 className="font-grotesk mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        How this archive earns trust.
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        Every fact on Italian Rides carries a source line. This page explains
        where the facts come from, what the demo can and cannot do, and where
        the honest gaps are.
      </p>

      <Section id="research" title="How model history is researched">
        <p>
          Model entries start from public references — marque histories,
          museum collections, and long-standing enthusiast documentation —
          then get paraphrased into short archive copy. Nothing is copied
          verbatim; each model page ends with a mono source line naming its
          references.
        </p>
        <p>
          Twelve milestones currently stand in for eighty years. That is a
          deliberate demo slice, not a claim of completeness — the catalogue
          schema is built to grow model by model.
        </p>
      </Section>

      <Section id="variants" title="Model family vs exact variant">
        <p>
          A family (PX, GTS, Primavera) spans decades of production; a variant
          is one exact configuration — engine, years, market, frame range. The
          demo documents one configuration per milestone and says so on the
          page. It never silently guesses your variant from a photo.
        </p>
      </Section>

      <Section id="specs" title="How specifications are verified">
        <p>
          Specs shown — displacement, production years, factory — come from
          the cited references. Unknown values are omitted or marked, never
          invented. Fitment and procedures in this build are illustrative and
          labelled as such: always confirm against the frame number and the
          parts book.
        </p>
      </Section>

      <Section id="recognition" title="How recognition works today">
        <p>
          The inspect flow uses a local filename heuristic plus your own
          eyes — no machine learning is connected. Your photo is downscaled
          in the browser with metadata stripped, stored only in this
          browser, and you confirm the component yourself.
        </p>
        <p>
          The production design targets a vision model plus segmentation
          (SAM-class masks) with the same honesty rules: uncertain results
          say so, failed requests keep your image and context, and nothing
          ever presents a guess as a match.
        </p>
      </Section>

      <Section id="compatibility" title="Identification is not compatibility">
        <p>
          “This appears to be a left mirror” is an identification. “This exact
          replacement fits your scooter” additionally needs the variant, the
          frame range, and a verified part reference. The UI keeps those two
          statements separate everywhere — component pages, inspect results,
          and repair guides.
        </p>
      </Section>

      <Section id="sources" title="Sources, imagery & licensing">
        <p>
          Studio illustrations are AI-generated in one coherent style —
          representative, not exact: compare details against the documentary
          photographs. Photographs come from Wikimedia Commons under their
          stated Creative Commons licences, credited per image and in the
          credits file. Parts documentation is consulted for facts only —
          manuals and catalogues are never redistributed.
        </p>
      </Section>

      <Section id="corrections" title="Corrections">
        <p>
          Found an error? Note the page and the source line and raise it
          with the team. The full product will carry a public correction
          process with per-claim review status.
        </p>
      </Section>

      <Section id="independence" title="Independent platform">
        <p>
          Italian Rides is an independent fan-made archive built for the Meta
          Hackathon, October 2026. It is not affiliated with, endorsed by, or
          connected to Piaggio, Vespa, or any club or seller listed. Model
          facts are paraphrased from public sources.
        </p>
        <p>
          <Link href="/archive" className="font-medium text-rosso underline underline-offset-2">
            Back to the archive →
          </Link>
        </p>
      </Section>
    </div>
  );
}
