"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  VESPA_PARTS,
  rankPartsByHints,
  type VespaPartId,
} from "@/lib/vespa-inspect";
import { pilotToAssembly, pxGuidesApply } from "@/lib/guided-inspect";
import { COMPONENT_INFO } from "@/lib/component-info";
import { ARCHIVE_MODELS } from "@/lib/models";
import { BOUNDED_ACTIONS } from "@/lib/bounded-actions";
import { FAMILIES } from "@/lib/vespa-families";
import {
  confidenceBand,
  getSession,
  saveSession,
  takeEvictionNotice,
  type InspectionSession,
} from "@/lib/inspect-session";
import { SamOutliner } from "@/components/sam-outliner";
import { GtsPilot } from "@/components/gts-pilot";
import { GuidedDetail } from "@/components/guided-detail";
import { AgentTrace } from "@/components/agent-trace";
import { RequestDraft } from "@/components/request-draft";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SamOverlay } from "@/lib/sam-parse";
import { inspectionLabel } from "@/lib/inspection-label";

export function InspectWorkspace() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<InspectionSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [unidentified, setUnidentified] = useState(false);
  const [evicted, setEvicted] = useState(0);
  const [outlineControls, setOutlineControls] = useState<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"agent" | "manual">("agent");
  const [preview, setPreview] = useState<SamOverlay | null>(null);

  useEffect(() => {
    setSession(getSession(params.sessionId));
    setEvicted(takeEvictionNotice());
    setLoaded(true);
  }, [params.sessionId]);

  function update(patch: Partial<InspectionSession>) {
    setSession((s) => {
      if (!s) return s;
      const next = { ...s, ...patch };
      saveSession(next);
      return next;
    });
  }

  if (!loaded) {
    return (
      <div className="animate-pulse space-y-3" aria-label="Loading session">
        <div className="h-8 w-1/3 bg-zinc-100" />
        <div className="h-64 bg-zinc-100" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="border border-dashed border-line px-6 py-12 text-center">
        <p className="font-grotesk text-2xl font-bold">Session not found.</p>
        <p className="mt-2 text-sm text-zinc-600">
          Sessions live in this browser only — it may have been cleared.
        </p>
        <Link href="/inspect" className={cn(buttonVariants({}), "mt-5")}>
          Start a new inspection
        </Link>
      </div>
    );
  }

  // A recommendation is highlighted for review, but never persisted as confirmed.
  const topCandidate = session.ai?.components[0];
  const suggestedId = !unidentified && topCandidate && topCandidate.confidence >= 0.6
    ? topCandidate.id as VespaPartId : null;
  const selectedId = session.selectedPart ?? suggestedId;
  const selected = VESPA_PARTS.find((p) => p.id === selectedId) ?? null;
  const slug =
    ARCHIVE_MODELS.find((m) => m.m === session.family)?.slug ??
    ARCHIVE_MODELS.find(
      (m) =>
        m.m === FAMILIES.find((f) => f.label === session.family)?.archive,
    )?.slug;
  const mapped = session.status === "mapped";
  const displayLabel = inspectionLabel(session);
  const componentDescription = /tyre|tire/i.test(displayLabel)
    ? "The tyre connects the wheel to the road. Use the checks below to decide what needs an in-person inspection."
    : /mirror/i.test(displayLabel)
      ? "The mirror provides the rider’s rearward view. Inspect the glass, stalk and mounting as separate areas."
      : selected ? `${COMPONENT_INFO[selected.id].function.split(". ")[0]}.` : "";
  const ai = session.ai ?? null;
  const action = selected ? (BOUNDED_ACTIONS[selected.id] ?? null) : null;
  const rankedIds = rankPartsByHints(ai ? ai.components : null);
  const topHint = ai && ai.components.length > 0 ? ai.components[0].id : null;

  function select(id: VespaPartId | null) {
    setUnidentified(false);
    setPreview(null);
    // Assembly choice wins: a mask-bound pilot pick for another component
    // must not linger and contradict the Garage draft.
    update({
      selectedPart: id,
      status: id ? "selected" : "matched",
      subPart: null,
      guidedAnswer: null,
      pilotSelection: null,
      agentObservation: null,
    });
  }

  return (
    <div className="pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-4">
          <Link href="/inspect" className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-ink"><ArrowLeft className="size-4" aria-hidden /> New photo</Link>
          <span className="hidden text-sm text-zinc-500 sm:inline">{session.family || "Scooter not identified"}{session.engine ? ` · ${session.engine}` : ""}{session.year ? ` · ${session.year}` : ""}</span>
        </div>
        <p className="text-xs text-zinc-500">{mapped ? "03 / Explore" : selected ? "02 / Confirm" : "01 / Select"}</p>
      </div>
      {evicted > 0 && <p role="note" className="mt-2 text-sm text-amber-800">Storage was full; {evicted} older inspection{evicted === 1 ? " was" : "s were"} removed.</p>}
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="min-w-0">
          <SamOutliner imageDataUrl={session.imageDataUrl} fileName={session.fileName} hints={(ai?.components ?? []).slice(0, 3).map(c => ({id:c.id,label:VESPA_PARTS.find(p=>p.id===c.id)?.label ?? c.label}))} initial={preview ?? session.sam ?? null} onSave={sam => update({sam,pilotSelection:null})} controlsTarget={outlineControls} interactive={!mapped && mode === "manual"}/>
          <p className="mt-2 text-xs text-zinc-500">{session.fileName} · {mapped ? "Choose Change to adjust the selection." : mode === "agent" ? "Your photo stays in view as the agent works." : "Click a part of the photo to outline it."}</p>
        </div>
        <aside className="min-w-0 lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto" aria-label="Inspection steps">
          <div className="border border-zinc-200 bg-white p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-2"><div><p className="text-xs font-medium text-zinc-500">{mapped ? "COMPONENT SELECTED" : "01 / FIND THE PART"}</p><h1 className="mt-1 text-xl font-semibold">{mapped && selected ? displayLabel : "What are we looking at?"}</h1></div>{mapped && <button type="button" onClick={() => {setMode("manual");setPreview(null);update({status:"selected"})}} className="text-xs underline">Change</button>}</div>
            {!mapped && <div className="mt-4 flex gap-2 border-b border-zinc-200 pb-3" role="group" aria-label="Inspection method"><button type="button" aria-pressed={mode === "agent"} onClick={()=>setMode("agent")} className={cn("px-3 py-2 text-sm",mode === "agent" && "bg-ink text-white")}>Agent inspection</button><button type="button" aria-pressed={mode === "manual"} onClick={()=>{setMode("manual");setPreview(null)}} className={cn("px-3 py-2 text-sm",mode === "manual" && "bg-ink text-white")}>Choose manually</button></div>}
            {!mapped && mode === "agent" && <AgentTrace imageDataUrl={session.imageDataUrl} concern={session.concern ?? ""} overview={ai} onPreview={setPreview} onSelect={result => { if (!result.focusId) return; setUnidentified(false); update({selectedPart:result.focusId, status:"mapped", subPart:null, guidedAnswer:null, pilotSelection:null, agentObservation:{focusId:result.focusId,targetLabel:result.focusLabel,detailNote:result.detailNote,band:result.band}, ...(result.mask?.svgPath ? {sam:{matches:[result.mask], side:"", label:result.focusLabel}} : {sam:null}), ...(result.overview ? {ai:result.overview} : {})}); }}/>}
            {!mapped && mode === "manual" && <div ref={setOutlineControls} />}
            {!mapped && mode === "manual" && <>
              <div className="mt-3 border-t border-zinc-200 pt-3">
                <p className="mb-2 text-xs font-medium text-zinc-600">02 / CHOOSE A COMPONENT</p>
                <div className="grid grid-cols-2 gap-2">{rankedIds.map(id => { const part = VESPA_PARTS.find(x => x.id === id)!; const active = selectedId === id; const conf = ai?.components.find(c => c.id === id)?.confidence; return <button key={id} type="button" onClick={() => select(id)} aria-pressed={active} className={cn("border px-3 py-2 text-left text-sm", active ? "border-ink bg-ink text-white" : "border-zinc-200 hover:border-ink")}><span className="block font-medium">{part.label}</span>{topHint === id && <span className="block text-xs opacity-70">Suggested{conf !== undefined ? ` · ${confidenceBand(conf)} model confidence` : ""}</span>}</button>; })}</div>
                {selected && <button type="button" onClick={() => update({selectedPart:selected.id,status:"mapped"})} className={cn(buttonVariants({}), "mt-3 w-full")}>Continue with {selected.label} <ArrowRight aria-hidden /></button>}
                <button type="button" onClick={() => {select(null);setUnidentified(true);}} className="mt-3 text-xs text-zinc-500 underline">I can’t identify the part</button>
                {unidentified && <p className="mt-2 text-sm text-zinc-600">Try another angle or <Link href="/archive" className="underline">browse the archive</Link>.</p>}
              </div>

            </>}
            {mapped && selected && <>
              <p className="mt-2 text-sm text-zinc-600">{componentDescription}</p>
              {session.agentObservation?.focusId === selected.id && session.agentObservation.detailNote && <p className="mt-3 bg-zinc-50 p-3 text-sm">Agent observation: {session.agentObservation.detailNote} <span className="text-zinc-500">· Unverified; confirm in person.</span></p>}
              {action && <details className="mt-4 border-t border-zinc-200 pt-3"><summary className="cursor-pointer text-sm font-medium">{action.title} · source and guidance</summary><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">{action.lines.map(l=><li key={l}>{l}</li>)}</ul><p className="mt-2 text-xs text-zinc-500">Source: {action.source}</p></details>}
              <details className="mt-4 border-t border-zinc-200 pt-3"><summary className="cursor-pointer text-sm font-medium">Explore this component</summary><GuidedDetail part={selected.id} concern={session.concern} subPart={session.subPart ?? null} guidedAnswer={session.guidedAnswer ?? null} onAnswer={(guidedAnswer,subPart)=>update({guidedAnswer,subPart})} onSelectSub={subPart=>update({subPart})}/></details>
              {slug && (slug !== "vespa-gts-granturismo" || selected.id === "handlebar") && <Link href={`/models/${slug}/viewer?component=${selected.id}`} className={cn(buttonVariants({}), "mt-4 w-full")}>Explore the 3D study <ArrowRight aria-hidden /></Link>}
              {pxGuidesApply(session.family || "") && <Link href={`/repairs/${selected.id}`} className={cn(buttonVariants({variant:"outline"}), "mt-2 w-full")}>Explore repair information</Link>}
              <RequestDraft key={`${displayLabel}:${session.guidedAnswer ?? ""}`} session={session} componentLabel={displayLabel}/>
              <Link href={`/garage?from=${session.id}`} className={cn(buttonVariants({variant:"outline"}), "mt-2 w-full")}>Record in My Garage</Link>
            </>}
          </div>
          {mapped && session.sam && (selected?.id === "handlebar" || selected?.id === "wheels") && <details className="mt-3 border border-zinc-200 bg-white p-4"><summary className="cursor-pointer text-sm font-medium">Connect this outline to the GTS study</summary><GtsPilot session={session} onConfirm={pilotSelection=>update(pilotSelection ? {pilotSelection,selectedPart:pilotToAssembly(pilotSelection.componentId),status:"mapped",subPart:null,guidedAnswer:null} : {pilotSelection})}/></details>}
          <details className="mt-3 text-xs text-zinc-500"><summary className="cursor-pointer">How this result was prepared</summary><p className="mt-2">{session.matchNote} {session.sam ? `SAM returned ${session.sam.matches.length} outline(s).` : "No outline has been saved."}</p></details>
        </aside>
      </div>
    </div>
  );
}
