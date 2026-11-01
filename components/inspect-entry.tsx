"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FAMILIES, familyFromArchive } from "@/lib/vespa-families";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { COMPONENT_INFO } from "@/lib/component-info";
import { PhotoUploader } from "@/components/photo-uploader";
import { ScooterStage } from "@/components/field-guide";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InspectEntry() {
  const params = useSearchParams();
  const model = params.get("model") ?? "";
  const part = params.get("part") ?? "";
  const initialModel = FAMILIES.some((f) => f.label === model)
    ? model
    : familyFromArchive(model);
  const initialPart = VESPA_PARTS.some((p) => p.id === part) ? part : "wheels";
  const [partId, setPartId] = useState(initialPart);
  const [mode, setMode] = useState<"photo" | "guide">("photo");
  const selected = VESPA_PARTS.find((p) => p.id === partId) ?? VESPA_PARTS[0];
  const info = COMPONENT_INFO[selected.id];

  return (
    <div>
      <div className="mb-5 inline-flex border border-zinc-200 p-1" role="group" aria-label="Choose how to explore">
        <button type="button" aria-pressed={mode === "photo"} onClick={() => setMode("photo")} className={cn("px-5 py-2 text-sm",mode === "photo" && "bg-ink text-white")}>Your photo</button>
        <button type="button" aria-pressed={mode === "guide"} onClick={() => setMode("guide")} className={cn("px-5 py-2 text-sm",mode === "guide" && "bg-ink text-white")}>Field guide</button>
      </div>
      {mode === "guide" ? <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]"><div>
        <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
          THE FIELD GUIDE
        </p>
        <div className="mt-3 border border-zinc-300 bg-white p-6">
          <ScooterStage fuel="injection" showSystem={false} />
          <p className="mt-3 font-mono text-[11px] tracking-[0.08em] text-zinc-600">
            SIMPLIFIED VESPA PROFILE — SELECT AN AREA BELOW
          </p>
        </div>
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Choose an area to explore"
        >
          {VESPA_PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPartId(p.id)}
              aria-pressed={partId === p.id}
              className={cn(
                buttonVariants({
                  variant: partId === p.id ? "default" : "outline",
                }),
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-4 border border-zinc-300 bg-white p-5">
          <p className="font-grotesk text-xl font-bold">{selected.label}</p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.08em] text-zinc-600">
            {info.assembly.toUpperCase()} — {info.location.toUpperCase()}
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-zinc-700">
            {info.function}
          </p>
        </div>
      </div><div className="border-l border-zinc-200 pl-6"><p className="text-sm text-zinc-600">Explore the machine, then compare a component with your own photo.</p><button type="button" onClick={() => setMode("photo")} className="mt-4 border border-ink px-4 py-2 text-sm">Use a photo →</button></div></div> : <PhotoUploader initialModel={initialModel} selectedPart={part} ctaLabel="Continue to inspection" />}
    </div>
  );
}
