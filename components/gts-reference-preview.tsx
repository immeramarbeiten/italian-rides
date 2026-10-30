"use client";
import { useState } from "react";
import GtsMirrorLazy from "./gts-mirror-lazy";
import type { GtsPilotId } from "@/lib/gts-pilot";
export function GtsReferencePreview() {
  const [id,setId]=useState<GtsPilotId>("gts125-mirror-right");
  return <div><p className="font-mono text-xs text-zinc-500">INDEPENDENT GTS 125 REFERENCE STUDY</p><h1 className="mt-2 text-3xl font-bold">Mirror and handlebar</h1><p className="mt-3 max-w-2xl text-sm text-zinc-600">Original procedural 3D concept. Geometry, mounting and proportions are illustrative; this is not a measured factory part.</p><div className="my-4 flex gap-2">{(["gts125-mirror-left","gts125-mirror-right"] as const).map(v=><button key={v} type="button" aria-pressed={id===v} onClick={()=>setId(v)} className={`border px-4 py-2 ${id===v?"bg-ink text-white":"border-line"}`}>{v.endsWith("left")?"Left mirror":"Right mirror"}</button>)}</div><GtsMirrorLazy componentId={id}/><p className="mt-2 text-sm text-zinc-600">Drag to orbit. Side is from the rider’s position; the underlying vehicle is a stylized reference.</p></div>;
}
