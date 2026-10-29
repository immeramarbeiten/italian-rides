import Link from "next/link";

export const metadata = {
  title: "Collector dossier — Italian Rides",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default function PassportPage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        COLLECTORS — PREVIEW
      </p>
      <h1 className="font-grotesk mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
        Shareable dossiers stay private until the owner says otherwise.
      </h1>
      <div className="mt-6 max-w-2xl border border-dashed border-line bg-white p-6">
        <p className="text-sm leading-relaxed text-zinc-600">
          A public passport will read like an authenticated design-object
          dossier — identity, original specs, ownership and restoration
          timeline, documented part changes, evidence, and a verification
          status on every claim. Nothing here is shared.
        </p>
        <Link
          href="/garage"
          className="mt-4 inline-block text-sm font-medium text-rosso underline underline-offset-2"
        >
          Back to your (private) garage
        </Link>
      </div>
    </div>
  );
}
