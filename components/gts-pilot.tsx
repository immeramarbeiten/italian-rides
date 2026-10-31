"use client";

import { useId, useState } from "react";
import { GTS_PILOT_COMPONENTS, pilotScope, type GtsPilotId } from "@/lib/gts-pilot";
import type { InspectionSession } from "@/lib/inspect-session";
import { GtsAssemblyExperience } from "./gts-assembly-experience";

const base = "/gts125-visual-prototype/";
const mirrorPath = "M 852 91 C 848 67 860 36 884 28 C 904 22 924 31 933 47 C 942 66 932 98 915 112 C 901 125 882 120 872 111 L 773 165 L 760 166 L 763 155 L 861 98 Z";
const tyrePath = "M 430 626 C 505 632 562 685 565 770 C 570 864 515 937 434 953 C 355 966 291 915 274 845 C 253 762 282 681 337 647 C 364 630 398 624 430 626 Z";

type Selection = NonNullable<InspectionSession["pilotSelection"]>;
export function GtsPilot({ session, onConfirm }: { session: InspectionSession; onConfirm: (value: Selection | null) => void }) {
  const [candidate, setCandidate] = useState<GtsPilotId | "">("");
  const [objectId, setObjectId] = useState("");
  const [showReference, setShowReference] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const uid = useId().replace(/:/g, "");
  const usable = (session.sam?.matches ?? []).filter((m) => !!m.svgPath);
  const selection = session.pilotSelection;
  const confirmedMask = usable.find((m) => m.objectId === selection?.objectId);
  const scope = pilotScope(session.family, session.engine);
  const matchId = objectId || (usable.length === 1 ? usable[0].objectId : "");
  const mirror = selection && GTS_PILOT_COMPONENTS[selection.componentId].kind === "mirror";
  function confirm() {
    if (!candidate || !usable.some((m) => m.objectId === matchId)) return;
    onConfirm({ componentId: candidate, objectId: matchId, confirmedAt: new Date().toISOString() });
    setShowReference(false); setShow3d(false);
  }
  if (scope === "outside") return null;
  return <section className="mt-6 border border-line bg-white p-5" aria-labelledby="gts-pilot-title">
    <p className="font-mono text-xs text-zinc-500">GTS REFERENCE STUDY · PILOT</p>
    <h2 id="gts-pilot-title" className="mt-2 text-xl font-bold">Take a closer look</h2>
    <p className="mt-2 text-sm text-zinc-600">Outline one visible part above, then tell us what that outline contains. Left and right are from the rider’s seat.</p>
    {scope === "unknown" && <p className="mt-2 text-xs text-zinc-600">Your scooter configuration is unknown. The following is a GTS 125 reference only; applicability is not verified.</p>}
    {scope === "reference" && <p className="mt-2 text-xs text-zinc-600">GTS 125 selected; this does not verify the exact market, year or catalogue configuration.</p>}
    {usable.length === 0 ? <p className="mt-4 text-sm">A decoded SAM mask is needed before you can link a part to this study.</p> : <>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose the outlined component">
        {(Object.keys(GTS_PILOT_COMPONENTS) as GtsPilotId[]).map((id)=><button key={id} type="button" aria-pressed={candidate===id} onClick={()=>setCandidate(id)} className={`border px-3 py-2 text-sm ${candidate===id?"border-ink bg-ink text-white":"border-line"}`}>{GTS_PILOT_COMPONENTS[id].label}</button>)}
      </div>
      {usable.length > 1 && <label className="mt-3 block text-sm">Which outline? <select className="ml-2 border border-line p-2" value={objectId} onChange={(e)=>setObjectId(e.target.value)}><option value="">Choose an outline</option>{usable.map((m,i)=><option key={m.objectId} value={m.objectId}>Outline {i+1} · object {m.objectId}</option>)}</select></label>}
      <button type="button" className="mt-3 border border-ink px-4 py-2 text-sm disabled:opacity-40" disabled={!candidate || !matchId} onClick={confirm}>Confirm this outline</button>
    </>}
    {selection && confirmedMask && <div className="mt-5 border-t border-line pt-5">
      <h3 className="text-lg font-bold">{GTS_PILOT_COMPONENTS[selection.componentId].label}</h3>
      <p className="mt-1 text-sm text-zinc-600">You confirmed this SAM outline. It is not a diagnosis or a verified vehicle identification.</p>
      <button type="button" onClick={()=>{setShowReference(true);setShow3d(false)}} className="mt-3 bg-ink px-4 py-2 text-sm text-white">See the reference study</button>
      {showReference && <div className="mt-4">
        <div className="gts-transition relative overflow-hidden bg-zinc-100">
          <svg viewBox="0 0 1536 1024" className="block w-full" role="img" aria-label="Generated GTS reference with selectable component layer">
            <defs><clipPath id={`${uid}-reference`}><path d={mirror ? mirrorPath : tyrePath}/></clipPath></defs>
            <image href={base+(mirror?"gts125-mirror-background.png":"gts125-tyre-background.png")} width="1536" height="1024" />
            <image href={base+"gts125-reference-study.png"} width="1536" height="1024" clipPath={`url(#${uid}-reference)`} className="gts-reference-part" />
          </svg>
          <svg className="gts-photo-cutout pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${confirmedMask.frame.w} ${confirmedMask.frame.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs><mask id={`${uid}-photo`} maskUnits="userSpaceOnUse" x="0" y="0" width={confirmedMask.frame.w} height={confirmedMask.frame.h}><path d={confirmedMask.svgPath!} fill="white" transform={`translate(${confirmedMask.box.x1} ${confirmedMask.box.y1}) scale(${(confirmedMask.box.x2-confirmedMask.box.x1)/confirmedMask.raster.w} ${(confirmedMask.box.y2-confirmedMask.box.y1)/confirmedMask.raster.h})`}/></mask></defs>
            <image href={session.imageDataUrl} width={confirmedMask.frame.w} height={confirmedMask.frame.h} mask={`url(#${uid}-photo)`}/>
          </svg>
        </div>
        <style>{`@keyframes gts-cutout {0%{opacity:1;transform:scale(1)} 65%{opacity:1;transform:scale(.8)} 100%{opacity:0;transform:scale(.72)}} @keyframes gts-reveal {0%,60%{opacity:0}100%{opacity:1}} .gts-photo-cutout{animation:gts-cutout 1.4s ease both;transform-origin:center}.gts-reference-part{animation:gts-reveal 1.4s ease both}@media(prefers-reduced-motion:reduce){.gts-photo-cutout{display:none}.gts-reference-part{animation:none}}`}</style>
        <p className="mt-2 text-xs text-zinc-500">Generated reference, not your scooter or a reconstruction. Component outlines and mechanical proportions are approximate; the image’s mirror side has not been verified.</p>
        {mirror && <><button type="button" onClick={()=>setShow3d(!show3d)} aria-expanded={show3d} className="mt-3 border border-ink px-4 py-2 text-sm">{show3d?"Hide":"Explore"} 3D mirror study</button>{show3d && <div className="mt-3"><GtsAssemblyExperience initialComponentId={selection.componentId}/></div>}</>}
        <div className="mt-4 border border-line p-4 text-sm"><h4 className="font-bold">What is documented?</h4>
          {mirror ? <p className="mt-2">The GTS 125 owner guide mentions mirror removal during headlamp access (PDF p. 54). The workshop manual lists a mirror-replacement operation (PDF p. 266); this is not a part number or a complete repair procedure. Exact scooter applicability and part fitment are unverified.</p> : <p className="mt-2">The GTS 125 owner guide describes cold tyre-pressure and wear checks (PDF pp. 24, 39–40) and refers tyre replacement to an equipped service provider (PDF p. 60). Use the vehicle manufacturer’s pressure for the exact scooter and load; the sidewall maximum is not a substitute. Vehicle applicability needs confirmation.</p>}
        </div>
      </div>}
    </div>}
  </section>;
}
