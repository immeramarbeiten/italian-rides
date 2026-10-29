"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VESPA_MODELS } from "@/lib/vespa-data";

function ModelNoteInner() {
  const params = useSearchParams();
  const name = params.get("model");
  if (!name) return null;
  const model = VESPA_MODELS.find((m) => m.m === name);
  if (!model) return null;
  return (
    <p className="mt-3 border border-lagoon bg-parchment px-4 py-3 text-sm">
      <span className="font-medium">
        Selected from the timeline: {model.m} ({model.y})
      </span>{" "}
      <span className="text-zinc-600">
        — {model.engine}. The inspection points below apply to it.{" "}
      </span>
      <Link href="/timeline" className="underline underline-offset-2">
        Back to timeline
      </Link>
    </p>
  );
}

export function InspectModelNote() {
  return (
    <Suspense fallback={null}>
      <ModelNoteInner />
    </Suspense>
  );
}
