"use client";

import { useState } from "react";
import { runInspectAgent, type AgentEvent, type AgentResult } from "@/lib/agent";
import { padBox, type Box } from "@/lib/agent-decide";
import type { AiResult } from "@/lib/inspect-session";
import type { SamOverlay } from "@/lib/sam-parse";

const STEPS = [
  ["look", "Review photo"], ["focus", "Choose focus"], ["outline", "Outline part"],
  ["zoom", "Inspect close-up"], ["conclude", "Prepare suggestion"],
] as const;

async function cropPhoto(imageDataUrl: string, box: Box, frame: {w: number; h: number}): Promise<string | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image(); el.onload = () => resolve(el); el.onerror = reject; el.src = imageDataUrl;
    });
    const w = img.naturalWidth, h = img.naturalHeight;
    if (!w || !h || !frame.w || !frame.h) return null;
    const b = padBox({x1:box.x1*w/frame.w,y1:box.y1*h/frame.h,x2:box.x2*w/frame.w,y2:box.y2*h/frame.h},w,h);
    const canvas = document.createElement("canvas"); canvas.width = Math.max(1,b.x2-b.x1); canvas.height = Math.max(1,b.y2-b.y1);
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    ctx.drawImage(img,b.x1,b.y1,canvas.width,canvas.height,0,0,canvas.width,canvas.height);
    return canvas.toDataURL("image/jpeg",.85);
  } catch { return null; }
}

export function AgentTrace({imageDataUrl, concern, overview, onSelect, onPreview}: {
  imageDataUrl: string; concern: string; overview?: AiResult | null;
  onSelect: (result: AgentResult) => void;
  onPreview?: (overlay: SamOverlay | null) => void;
}) {
  const [events,setEvents] = useState<AgentEvent[]>([]);
  const [running,setRunning] = useState(false);
  const [result,setResult] = useState<AgentResult | null>(null);
  const [crop,setCrop] = useState<string | null>(null);
  async function run() {
    setRunning(true); setEvents([]); setResult(null); setCrop(null); onPreview?.(null);
    try {
      const r = await runInspectAgent({imageDataUrl,concern,initialOverview:overview,
        onMask:(mask,label)=>onPreview?.({matches:[mask],side:"",label}),
        cropToBox:async(box,frame)=>{const image=await cropPhoto(imageDataUrl,box,frame);setCrop(image);return image},
      },e=>setEvents(prev=>[...prev,e]));
      setResult(r);
    } finally { setRunning(false); }
  }
  const latest=events[events.length-1];
  return <section aria-label="Agent inspection" className="mt-4" data-demo="agent">
    {concern && <p className="mb-3 border-l-2 border-ink pl-3 text-sm text-zinc-700">“{concern}”</p>}
    {events.length === 0 && <>
      <p className="text-sm text-zinc-600">Follow the concern, outline the part and examine a close-up.</p>
      <p className="mt-2 text-xs text-zinc-500">Uses Meta to analyse this photo and a close-up, with up to {overview ? "2" : "3"} further calls.</p>
      <button type="button" onClick={()=>void run()} className="mt-3 w-full bg-ink px-4 py-3 text-sm font-medium text-white">Inspect with agent →</button>
    </>}
    {events.length > 0 && <>
      <ol className="space-y-2" aria-label="Agent progress">{STEPS.map(([id,label])=>{const event=events.filter(e=>e.step===id).at(-1);return <li key={id} className="flex items-center gap-3 text-sm"><span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${event?.status==="fail"?"bg-amber-100 text-amber-800":event?.status==="done"?"bg-ink text-white":"bg-zinc-100 text-zinc-500"}`} aria-hidden>{event?.status==="done"?"✓":event?.status==="fail"?"!":event?.status==="start"?"…":"·"}</span><span className={event?"text-ink":"text-zinc-400"}>{label}</span></li>})}</ol>
      <p role="status" className="mt-3 text-xs leading-relaxed text-zinc-600">{latest?.detail}</p>
      {crop && <figure className="mt-3 flex items-start gap-3 border-t border-zinc-200 pt-3"><img src={crop} alt="Actual close-up cropped from the SAM outline" className="h-20 w-24 object-contain bg-zinc-100"/><figcaption className="text-xs text-zinc-500">Close-up from your photo.<br />{running?"Checking visible detail…":result?.detailNote || "See result below."}</figcaption></figure>}
    </>}
    {!running && result && <div className="mt-3 border-t border-zinc-200 pt-3">{result.focusId ? <>
      <p className="text-sm font-semibold">{result.focusLabel}</p>
      <p className="mt-1 text-xs text-zinc-600">{result.band} model confidence · {result.mask?"outline available":"no outline returned"}</p>
      {result.detailNote && <p className="mt-2 text-sm">Visible observation: {result.detailNote}</p>}
      <button type="button" onClick={()=>onSelect(result)} className="mt-3 w-full bg-ink px-4 py-3 text-sm font-medium text-white">Confirm part & continue →</button>
    </>:<p className="text-sm">No reliable suggestion. Choose a component manually or try a clearer photo.</p>}
      <button type="button" onClick={()=>void run()} className="mt-2 text-xs text-zinc-500 underline">Inspect again</button>
    </div>}
  </section>;
}
