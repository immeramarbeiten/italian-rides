"use client";
import { useState } from "react";
import GtsMirrorLazy from "./gts-mirror-lazy";
import type { GtsPilotId } from "@/lib/gts-pilot";

export function GtsReferencePreview() {
  const [id, setId] = useState<GtsPilotId>("gts125-mirror-right");
  const [view, setView] = useState<"overview" | "dashboard">("overview");
  return <div>
    <p className="font-mono text-xs text-zinc-500">INDEPENDENT GTS 125 REFERENCE STUDY</p>
    <h1 className="mt-2 text-3xl font-bold">Mirror and handlebar</h1>
    <p className="mt-3 max-w-2xl text-sm text-zinc-600">An illustrative 3D study. The instrument layout follows the GTS 125 owner’s guide; dimensions, markings and details are not verified factory specifications.</p>
    <div className="my-4 flex flex-wrap gap-2" role="group" aria-label="Select a mirror">
      {(["gts125-mirror-left", "gts125-mirror-right"] as const).map(v => <button key={v} type="button" aria-pressed={id === v} onClick={() => setId(v)} className={`border px-4 py-2 ${id === v ? "bg-ink text-white" : "border-line"}`}>{v.endsWith("left") ? "Left mirror" : "Right mirror"}</button>)}
    </div>
    <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Choose a view">
      {(["overview", "dashboard"] as const).map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`border px-4 py-2 text-sm ${view === v ? "bg-ink text-white" : "border-line"}`}>{v === "overview" ? "Assembly view" : "Instrument view"}</button>)}
    </div>
    <GtsMirrorLazy componentId={id} view={view}/>
    <p className="mt-2 text-sm text-zinc-600">Drag to orbit. The dashboard is an interpretive reference, not a working or calibrated instrument.</p>
  </div>;
}
