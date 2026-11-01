"use client";

import { useState } from "react";
import type { InspectionSession } from "@/lib/inspect-session";

/** A user-reviewed enquiry, never a diagnosis, quotation or part order. */
export function RequestDraft({session, componentLabel}: {session: InspectionSession; componentLabel: string}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const vehicle = [session.family, session.engine && (session.engine === "Electric" ? "Electric" : `${session.engine} cc`), session.year].filter(Boolean).join(" · ") || "Model and year to confirm";
  const [text, setText] = useState(() => [
    "Hello, I’d like help inspecting my scooter.",
    `Scooter: ${vehicle}`,
    `Area selected: ${componentLabel}`,
    session.concern ? `My concern: ${session.concern}` : "My concern: [please describe what you noticed]",
    session.agentObservation?.focusId === session.selectedPart && session.agentObservation.detailNote ? `Unverified AI observation for review: ${session.agentObservation.detailNote}` : "",
    "Could you advise on inspection, repair or replacement options and provide an estimate? Please confirm the exact variant and any part fitment first.",
    "I can provide a photo and vehicle details if needed. Thank you.",
  ].filter(Boolean).join("\n"));
  return <div className="mt-3 border-t border-zinc-200 pt-3">
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="text-sm font-medium underline underline-offset-4">{open ? "Close request draft" : "Prepare a workshop request"}</button>
    {open && <div className="mt-3"><p className="text-xs text-zinc-600">Review and edit before copying. No message is sent and the photo is not attached.</p><label className="mt-2 block text-xs font-medium" htmlFor="request-draft">Your draft</label><textarea id="request-draft" value={text} onChange={e=>{setText(e.target.value);setCopied(false)}} rows={9} className="mt-1 w-full border border-zinc-300 p-3 text-sm"/><button type="button" onClick={async()=>{try {await navigator.clipboard.writeText(text);setCopied(true)} catch {setCopied(false)}}} className="mt-2 border border-ink px-4 py-2 text-sm">{copied ? "Copied" : "Copy request"}</button></div>}
  </div>;
}
