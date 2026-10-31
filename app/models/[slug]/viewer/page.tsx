import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ARCHIVE_MODELS, modelBySlug } from "@/lib/models";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { InspectViewer } from "@/components/inspect-viewer";
import { GtsAssemblyExperience } from "@/components/gts-assembly-experience";

export function generateStaticParams() {
  return ARCHIVE_MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = modelBySlug(slug);
  return { title: m ? `${m.m} in 3D — Italian Rides` : "Viewer — Italian Rides" };
}

export default async function ModelViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = modelBySlug(slug);
  if (!m) notFound();

  if (slug === "vespa-gts-granturismo") return (
    <div className="pt-10">
      <Link href={`/models/${slug}`} className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:underline"><ArrowLeft className="size-4" aria-hidden /> BACK TO MODEL</Link>
      <p className="mt-6 font-mono text-xs text-zinc-500">GTS 125 · INTERACTIVE STUDY</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">The front assembly</h1>
      <p className="mb-6 mt-3 max-w-2xl text-zinc-600">Explore the mirrors, controls, headlamp and instrument panel. Separate the parts to see how the study is composed.</p>
      <GtsAssemblyExperience />
      <Link href="/inspect?model=Vespa%20GTS%2FGranturismo" className="mt-6 inline-block text-sm underline underline-offset-4">Explore a component in your photo →</Link>
    </div>
  );

  return (
    <div className="pt-10">
      <Link
        href={`/models/${slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-rosso hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> BACK TO {m.m.toUpperCase()}
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-grotesk text-3xl font-black tracking-tight">
          {m.m} <span className="text-rosso">in 3D</span>
        </h1>
        <p className="font-mono text-xs text-zinc-500">
          DOCUMENTED CONFIGURATION · {m.y}
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.65fr_1fr]">
        <div className="min-w-0">
          <InspectViewer />
          <p className="mt-3 border border-zinc-300 bg-zinc-100 px-3 py-2 font-mono text-[11px] text-zinc-600">
            ONE MODEL STANDS IN FOR EVERY VARIANT — USE IT FOR
            ORIENTATION, NOT MEASUREMENT. SEE THE MODEL CREDIT BELOW.
          </p>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line bg-white p-5">
            <h2 className="font-grotesk text-lg font-bold">Assemblies</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Pick one to highlight it in the viewer. Every entry is a
              deep link — share it, bookmark it, use back/forward.
            </p>
            {/* Plain anchors (not client nav) so the viewer remounts with the selection. */}
            <ul className="mt-4 space-y-2">
              {VESPA_PARTS.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={`/models/${slug}/viewer?component=${p.id}`}
                    className="flex items-center gap-3 border border-line px-3 py-2.5 transition-colors hover:border-ink"
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center bg-zinc-100 font-mono text-xs">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{p.label}</span>
                      <span className="block font-mono text-[11px] text-zinc-500">
                        {p.id}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/models/${slug}`}
                className="text-sm font-medium text-rosso underline underline-offset-2"
              >
                Model overview
              </Link>
              <Link
                href={`/inspect?model=${encodeURIComponent(m.m)}`}
                className="text-sm font-medium text-rosso underline underline-offset-2"
              >
                Find on a real scooter
              </Link>
            </div>
            <p className="mt-4 font-mono text-[11px] leading-relaxed text-zinc-500">
              KEYBOARD: TAB TO A HOTSPOT OR CARD, ENTER TO SELECT. ESC CLEARS.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
