"use client";

import { useState } from "react";
import { runInspectAgent, type AgentEvent, type AgentResult } from "@/lib/agent";
import { padBox, type Box } from "@/lib/agent-decide";
import { cn } from "@/lib/utils";

const STEP_LABEL: Record<AgentEvent["step"], string> = {
  look: "Look",
  focus: "Focus",
  outline: "Outline",
  zoom: "Zoom",
  conclude: "Conclude",
};

/** Crop a data-URL photo to a (padded) box, in-browser. */
async function cropPhoto(imageDataUrl: string, box: Box, frame: {w: number; h: number}): Promise<string | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = imageDataUrl;
    });
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;
    if (!frame.w || !frame.h) return null;
    const b = padBox({x1:box.x1*w/frame.w,y1:box.y1*h/frame.h,x2:box.x2*w/frame.w,y2:box.y2*h/frame.h}, w, h);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, b.x2 - b.x1);
    canvas.height = Math.max(1, b.y2 - b.y1);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, b.x1, b.y1, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}

/**
 * Visible agentic inspect: look → focus → outline → zoom → conclude, with
 * each step narrated live. Ends in a suggestion the user still confirms —
 * the agent never selects or saves on its own.
 */
export function AgentTrace({
  imageDataUrl,
  concern,
  overview,
  onSelect,
}: {
  imageDataUrl: string;
  concern: string;
  overview?: import("@/lib/inspect-session").AiResult | null;
  onSelect: (result: AgentResult) => void;
}) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [running, setRunning] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);

  async function run() {
    setConfirming(false);
    setRunning(true);
    setEvents([]);
    setResult(null);
    const r = await runInspectAgent(
      {
        imageDataUrl,
        concern,
        initialOverview: overview,
        cropToBox: (box, frame) => cropPhoto(imageDataUrl, box, frame),
      },
      (e) => setEvents((prev) => [...prev, e]),
    );
    setResult(r);
    setRunning(false);
  }

  return (
    <div className="mt-5 border border-line bg-white p-4">
      <p className="font-mono text-[11px] tracking-[0.08em] text-zinc-600">
        AGENTIC INSPECT
      </p>
      {!running && events.length === 0 && !confirming && (
        <>
          <p className="mt-2 text-sm text-zinc-700">
            Let the agent choose a focus, outline it, and inspect a close-up. Each step is shown as it happens.
          </p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-3 border border-ink bg-ink px-4 py-2 font-mono text-xs text-white"
          >
            RUN THE AGENT
          </button>
        </>
      )}
      {confirming && (
        <div className="mt-2 text-sm">
          <p>
            This sends the photo or a close-up to Meta up to {overview ? "2" : "3"} more times for {overview ? "outlining and close-up analysis" : "identification, outlining and close-up analysis"}.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => void run()}
              className="border border-ink bg-ink px-3 py-1 font-mono text-xs text-white"
            >
              Run
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="border border-line px-3 py-1 font-mono text-xs"
            >
              Not now
            </button>
          </div>
        </div>
      )}
      {(running || events.length > 0) && (
        <ol className="mt-3 space-y-1.5" aria-live="polite">
          {events.map((e, i) => (
            <li key={i} className="flex gap-2 font-mono text-xs">
              <span
                className={cn(
                  "shrink-0",
                  e.status === "fail" ? "text-rosso-deep" : "text-zinc-500",
                )}
                aria-hidden
              >
                {e.status === "start" ? "…" : e.status === "fail" ? "!" : "✓"}
              </span>
              <span className="text-zinc-700">
                <span className="font-bold">{STEP_LABEL[e.step]}</span> — {e.detail}
              </span>
            </li>
          ))}
          {running && (
            <li className="animate-pulse font-mono text-xs text-zinc-500">
              working…
            </li>
          )}
        </ol>
      )}
      {!running && result && (
        <div className="mt-3 border-t border-line pt-3">
          {result.focusId ? (
            <>
              <p className="text-sm">
                Focus: <span className="font-medium">{result.focusLabel}</span>{" "}
                <span className="font-mono text-[11px] text-zinc-500">
                  ({result.band}
                  {result.mask ? ", outlined" : ", no outline"}
                  {result.detailNote ? ` · close-up: ${result.detailNote}` : ""})
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => result.focusId && onSelect(result)}
                  className="border border-ink bg-ink px-4 py-2 font-mono text-xs text-white"
                >
                  USE SUGGESTION
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="border border-line px-3 py-2 font-mono text-xs"
                >
                  Run again
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-600">
                The agent found nothing to focus on — pick manually below.
              </p>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="mt-2 border border-line px-3 py-2 font-mono text-xs"
              >
                Run again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
