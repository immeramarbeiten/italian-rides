"use client";

import { useId, useState } from "react";
import type { GtsPilotId } from "@/lib/gts-pilot";
import GtsMirrorLazy from "./gts-mirror-lazy";

type MirrorId = "gts125-mirror-left" | "gts125-mirror-right";

/** An interpretive scene. The offsets are presentation, not a disassembly procedure. */
export function GtsAssemblyExperience({ initialComponentId = "gts125-mirror-right" }: { initialComponentId?: GtsPilotId }) {
  const [mirror, setMirror] = useState<MirrorId>(initialComponentId === "gts125-mirror-left" ? "gts125-mirror-left" : "gts125-mirror-right");
  const [view, setView] = useState<"overview" | "dashboard">("overview");
  const [separation, setSeparation] = useState(0);
  const sliderId = useId();
  return <section aria-label="Interactive GTS 125 handlebar study" className="border border-zinc-200 bg-white">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 px-5 py-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">01 / Front assembly · GTS 125</p>
        <h2 className="mt-1 text-xl font-semibold">Mirror and handlebar</h2>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select mirror, viewed from rider's seat">
        {(["gts125-mirror-left", "gts125-mirror-right"] as const).map(id => <button key={id} type="button" aria-pressed={mirror === id} onClick={() => setMirror(id)} className={`border px-3 py-2 text-sm ${mirror === id ? "border-ink bg-ink text-white" : "border-zinc-300 hover:border-ink"}`}>{id.endsWith("left") ? "Left mirror" : "Right mirror"}</button>)}
      </div>
    </div>
    <GtsMirrorLazy componentId={mirror} view={view} explode={separation / 100}/>
    <div className="grid gap-5 border-t border-zinc-200 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <div className="flex justify-between gap-5 text-sm"><label htmlFor={sliderId} className="font-medium">Separate the assembly</label><output htmlFor={sliderId} className="font-mono text-zinc-600">{separation}%</output></div>
        <input id={sliderId} className="mt-2 w-full accent-red-700" type="range" min="0" max="100" value={separation} onChange={event => { setSeparation(Number(event.target.value)); if (Number(event.target.value) > 0) setView("overview"); }} />
        <p className="mt-1 text-xs text-zinc-500">Housing · mirrors · controls · headlamp · instruments</p>
      </div>
      <div className="flex gap-2" role="group" aria-label="Choose camera view">
        <button type="button" aria-pressed={view === "overview"} onClick={() => setView("overview")} className={`border px-3 py-2 text-sm ${view === "overview" ? "border-ink bg-ink text-white" : "border-zinc-300"}`}>Assembly</button>
        <button type="button" aria-pressed={view === "dashboard"} onClick={() => { setView("dashboard"); setSeparation(0); }} className={`border px-3 py-2 text-sm ${view === "dashboard" ? "border-ink bg-ink text-white" : "border-zinc-300"}`}>Instruments</button>
      </div>
    </div>
    <p className="border-t border-zinc-200 px-5 py-4 text-xs leading-relaxed text-zinc-600">Drag to orbit; use the slider or arrow keys to separate the parts. Left and right are from the rider’s seat. This original 3D study is informed by GTS 125 reference material, but its dimensions, components and separation are illustrative—not a verified parts diagram or removal sequence.</p>
  </section>;
}
