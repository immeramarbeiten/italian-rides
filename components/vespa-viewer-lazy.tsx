"use client";

import dynamic from "next/dynamic";

/** Client boundary so `ssr: false` dynamic import is legal. */
export const VespaViewerLazy = dynamic(
  () => import("@/components/vespa-viewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Warming up the engine…
      </div>
    ),
  },
);
