import Link from "next/link";

/** Branded 404 — keeps a mistyped judging click inside the product. */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <p className="font-mono text-xs text-zinc-500">NOTHING PARKED HERE</p>
      <h1 className="font-grotesk mt-2 text-3xl font-bold">
        That page doesn&apos;t exist
      </h1>
      <p className="mt-3 text-sm text-zinc-600">
        The archive, the inspect flow, and the garage are all one click away.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link
          href="/"
          className="border border-ink bg-ink px-5 py-2 font-mono text-xs text-white"
        >
          HOME
        </Link>
        <Link
          href="/inspect"
          className="border border-line px-5 py-2 font-mono text-xs"
        >
          INSPECT
        </Link>
      </div>
    </main>
  );
}
