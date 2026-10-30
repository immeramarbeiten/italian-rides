"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SamMatch, SamOverlay } from "@/lib/sam-parse";
import { cn } from "@/lib/utils";

type Status =
  | "idle"
  | "confirm"
  | "loading"
  | "shown"
  | "empty"
  | "failed"
  | "unavailable";

const PART_NOUN: Record<string, string> = {
  engine: "engine",
  wheels: "wheel",
  handlebar: "handlebar",
  frame: "scooter frame",
  legshield: "front legshield",
  seat: "seat",
};

/**
 * Tap-to-outline photo panel. Masks come only from live SAM 3.1 responses —
 * empty and failed states never render an outline.
 */
export function SamOutliner({
  imageDataUrl,
  fileName,
  hints,
  initial,
  onSave,
}: {
  imageDataUrl: string;
  fileName: string;
  hints: { id: string; label: string }[];
  initial: SamOverlay | null;
  onSave: (sam: SamOverlay | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [status, setStatus] = useState<Status>("idle");
  const [matches, setMatches] = useState<SamMatch[]>(initial?.matches ?? []);
  const [side, setSide] = useState<"" | "L" | "R">(initial?.side ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [consented, setConsented] = useState(false);
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null);
  const [pendingPhrase, setPendingPhrase] = useState<{
    phrase: string;
    label: string;
  } | null>(null);

  const shown = status === "shown" && matches.length > 0;

  const measure = useCallback(() => {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap || !img.naturalWidth) return;
    const elW = wrap.clientWidth;
    const elH = wrap.clientHeight;
    if (!elW || !elH) return;
    const s = Math.min(elW / img.naturalWidth, elH / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    setBox({ x: (elW - w) / 2, y: (elH - h) / 2, w, h });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, imageDataUrl]);

  useEffect(() => {
    if (initial && initial.matches.length > 0) setStatus("shown");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function run(body: Record<string, unknown>, lbl: string) {
    setStatus("loading");
    try {
      const res = await fetch("/api/sam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl, ...body }),
      });
      if (res.status === 503) {
        setStatus("unavailable");
        return;
      }
      if (!res.ok) throw new Error("bad response");
      const data = (await res.json()) as { matches?: SamMatch[] };
      const ms = Array.isArray(data.matches) ? data.matches.filter((m) => !!m.svgPath).slice(0, 3) : [];
      if (ms.length === 0) {
        setStatus("empty");
        return;
      }
      const overlay: SamOverlay = { matches: ms, side, label: lbl };
      setMatches(overlay.matches);
      setLabel(lbl);
      setStatus("shown");
      onSave(overlay);
    } catch {
      setStatus("failed");
    }
  }

  function onTap(e: React.MouseEvent) {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img?.naturalWidth || !wrap || !box.w || status === "loading") return;
    const r = wrap.getBoundingClientRect();
    const fx = (e.clientX - r.left - box.x) / box.w;
    const fy = (e.clientY - r.top - box.y) / box.h;
    if (fx < 0 || fy < 0 || fx > 1 || fy > 1) return;
    const x = Math.min(img.naturalWidth - 1, Math.floor(fx * img.naturalWidth));
    const y = Math.min(img.naturalHeight - 1, Math.floor(fy * img.naturalHeight));
    if (!consented) {
      setPending({ x, y });
      setStatus("confirm");
      return;
    }
    void run(
      { mode: "point", x, y, width: img.naturalWidth, height: img.naturalHeight },
      "tap",
    );
  }

  function outlineByName(h: { id: string; label: string }) {
    const body = { mode: "phrase", phrase: PART_NOUN[h.id] ?? h.label };
    if (consented) {
      void run(body, h.label);
      return;
    }
    setPendingPhrase({ phrase: body.phrase, label: h.label });
    setStatus("confirm");
  }

  function confirmOutline() {
    const img = imgRef.current;
    setConsented(true);
    if (pending && img?.naturalWidth) {
      void run(
        {
          mode: "point",
          x: pending.x,
          y: pending.y,
          width: img.naturalWidth,
          height: img.naturalHeight,
        },
        "tap",
      );
    } else if (pendingPhrase) {
      void run(
        { mode: "phrase", phrase: pendingPhrase.phrase },
        pendingPhrase.label,
      );
    } else {
      setStatus(matches.length > 0 ? "shown" : "idle");
    }
    setPending(null);
    setPendingPhrase(null);
  }

  function pickSide(s: "" | "L" | "R") {
    setSide(s);
    if (matches.length > 0) onSave({ matches, side: s, label });
  }

  function clear() {
    setMatches([]);
    setStatus("idle");
    onSave(null);
  }

  const frame = matches[0]?.frame;

  return (
    <div>
      <div
        ref={wrapRef}
        onClick={onTap}
        className="relative cursor-crosshair border border-line bg-zinc-100"
        role="button"
        tabIndex={-1}
        aria-label="Scooter photo. Activate the Outline buttons below to outline by name."
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageDataUrl}
          alt={`Uploaded scooter photograph: ${fileName}`}
          onLoad={measure}
          className="max-h-[70vh] w-full object-contain"
        />
        {shown && frame && box.w > 0 && (
          <div
            className="pointer-events-none absolute"
            style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
          >
            <svg
              viewBox={`0 0 ${frame.w} ${frame.h}`}
              className="h-full w-full text-rosso"
              aria-hidden
            >
              {matches.map((mm, i) => (
                <g key={i}>
                  <text x={mm.box.x1} y={Math.max(22, mm.box.y1 - 8)} fill="currentColor" fontSize="24">{i + 1}</text>
                  <rect
                    x={mm.box.x1}
                    y={mm.box.y1}
                    width={mm.box.x2 - mm.box.x1}
                    height={mm.box.y2 - mm.box.y1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeDasharray="10 7"
                  />
                  {mm.svgPath && (
                    <g
                      transform={`translate(${mm.box.x1} ${mm.box.y1}) scale(${(mm.box.x2 - mm.box.x1) / mm.raster.w} ${(mm.box.y2 - mm.box.y1) / mm.raster.h})`}
                    >
                      <path
                        d={mm.svgPath}
                        fill="currentColor"
                        fillOpacity={0.16}
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>
      <p className="mt-2 font-mono text-[11px] text-zinc-500">
        {shown
          ? `SAM 3.1 OUTLINE — ${label.toUpperCase()}. TAP ELSEWHERE TO RE-OUTLINE.`
          : "TAP THE PART TO OUTLINE IT — MASKS COME FROM LIVE SAM 3.1 RESPONSES."}
      </p>

      {status === "confirm" && (
        <div className="mt-2 border border-line bg-white px-3 py-2 text-sm">
          <p>
            {pendingPhrase
              ? `Outlining “${pendingPhrase.label}” sends this photo to Meta.`
              : "Tapping sends this photo to Meta for outlining."}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={confirmOutline}
              className="border border-ink bg-ink px-3 py-1 font-mono text-xs text-white"
            >
              Outline
            </button>
            <button
              type="button"
              onClick={() => {
                setPending(null);
                setPendingPhrase(null);
                setStatus(matches.length > 0 ? "shown" : "idle");
              }}
              className="border border-line px-3 py-1 font-mono text-xs"
            >
              Not now
            </button>
          </div>
        </div>
      )}
      {status === "loading" && (
        <p className="mt-2 font-mono text-xs text-zinc-500">Outlining…</p>
      )}
      {status === "empty" && (
        <p className="mt-2 border border-dashed border-line px-3 py-2 text-sm text-zinc-600">
          SAM found nothing there — try another spot, or outline by name below.
        </p>
      )}
      {status === "failed" && (
        <p className="mt-2 border border-rosso-deep px-3 py-2 text-sm text-rosso-deep">
          Segmentation failed — retry the tap.
          {matches.length > 0 && " Previous outline kept."}
        </p>
      )}
      {status === "unavailable" && (
        <p className="mt-2 border border-dashed border-line px-3 py-2 text-sm text-zinc-600">
          Segmentation unavailable (API key missing) — selection stays manual.
        </p>
      )}

      <div className="mt-3 border border-line bg-white p-3">
        <p className="font-mono text-[11px] text-zinc-500">
          OUTLINE BY NAME · RIDER SIDE: {side === "" ? "?" : side}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {hints.length === 0 && (
            <span className="text-sm text-zinc-500">
              No AI hints on this photo — tap it directly.
            </span>
          )}
          {hints.map((h) => (
            <button
              key={h.id}
              type="button"
              disabled={status === "loading"}
              onClick={() => outlineByName(h)}
              className={cn(
                "border px-3 py-1.5 font-mono text-xs",
                status === "loading"
                  ? "cursor-wait border-line text-zinc-400"
                  : "border-line hover:border-ink",
              )}
            >
              Outline {h.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(["", "L", "R"] as const).map((s) => (
            <button
              key={s || "unknown"}
              type="button"
              onClick={() => pickSide(s)}
              aria-pressed={side === s}
              className={cn(
                "border px-2.5 py-1 font-mono text-xs",
                side === s
                  ? "border-ink bg-ink text-white"
                  : "border-line hover:border-ink",
              )}
            >
              {s === "" ? "Side ?" : `Side ${s}`}
            </button>
          ))}
          {matches.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="ml-auto font-mono text-xs text-zinc-500 underline underline-offset-2 hover:text-rosso"
            >
              Clear outline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
