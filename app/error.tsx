"use client";

/** Demo-robust route error: explain, offer a way back, never a blank crash. */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <p className="font-mono text-xs text-zinc-500">SOMETHING STALLED</p>
      <h1 className="font-grotesk mt-2 text-3xl font-bold">
        This page hit a bump
      </h1>
      <p className="mt-3 text-sm text-zinc-600">
        Nothing was saved or sent by the failure itself. Retry, or head back
        and start the step again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 border border-ink bg-ink px-5 py-2 font-mono text-xs text-white"
      >
        TRY AGAIN
      </button>
    </main>
  );
}
