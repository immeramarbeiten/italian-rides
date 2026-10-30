"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VespaViewerLazy } from "@/components/vespa-viewer-lazy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GLB_CANDIDATES,
  GLB_CREDITS,
  VESPA_PARTS,
  type VespaPartId,
} from "@/lib/vespa-inspect";

export function InspectViewer() {
  const [explode, setExplode] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [xray, setXray] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [selected, setSelected] = useState<VespaPartId | null>(null);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [glbName, setGlbName] = useState<string | null>(null);
  const [foundGlbs, setFoundGlbs] = useState<string[]>([]);
  const [probing, setProbing] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  // Preselect a hotspot from ?component=<id> or ?part=<id> links.
  // Read via window.location so prerendering stays fully static.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const part = q.get("component") ?? q.get("part");
    if (part && VESPA_PARTS.some((p) => p.id === part)) {
      setSelected(part as VespaPartId);
      setExplode((e) => (e === 0 ? 0.35 : e));
    }
  }, []);

  // Probe /models/*.glb so a dropped-in licensed model just appears.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found: string[] = [];
      for (const name of GLB_CANDIDATES) {
        try {
          const res = await fetch(`/models/${name}`, { method: "HEAD" });
          if (res.ok) found.push(name);
        } catch {
          // Missing file or offline — procedural model stays.
        }
      }
      if (!cancelled) {
        setFoundGlbs(found);
        if (found.length > 0) {
          setGlbUrl(`/models/${found[0]}`);
          setGlbName(found[0]);
        }
        setProbing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPart = VESPA_PARTS.find((p) => p.id === selected) ?? null;
  const glbCredit = glbName ? (GLB_CREDITS[glbName] ?? null) : null;

  function reset() {
    setExplode(0);
    setWireframe(false);
    setXray(false);
    setSelected(null);
  }

  function loadPublicGlb(name: string) {
    setGlbUrl(`/models/${name}`);
    setGlbName(name);
  }

  function clearGlb() {
    setGlbUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setGlbName(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onFilePicked(file: File | undefined) {
    if (!file) return;
    setGlbUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setGlbName(file.name);
  }

  return (
    <div>
      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border border-stone-300 bg-parchment px-4 py-3">
        <label className="flex min-w-52 flex-1 items-center gap-3 text-sm">
          <span className="font-medium whitespace-nowrap">
            Exploded view
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(explode * 100)}
            onChange={(e) => setExplode(Number(e.target.value) / 100)}
            className="w-full accent-racing"
            aria-label="Exploded view amount"
            disabled={glbUrl !== null}
          />
          <span className="w-10 text-right text-zinc-600 tabular-nums">
            {Math.round(explode * 100)}%
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={wireframe ? "racing" : "outline"}
            onClick={() => setWireframe((v) => !v)}
            aria-pressed={wireframe}
            disabled={glbUrl !== null}
          >
            Wireframe
          </Button>
          <Button
            type="button"
            size="sm"
            variant={xray ? "racing" : "outline"}
            onClick={() => setXray((v) => !v)}
            aria-pressed={xray}
            disabled={glbUrl !== null}
          >
            X-ray
          </Button>
          <Button
            type="button"
            size="sm"
            variant={autoRotate ? "default" : "outline"}
            onClick={() => setAutoRotate((v) => !v)}
            aria-pressed={autoRotate}
          >
            Turntable
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      {/* 3D canvas */}
      <div className="relative mt-4 h-[420px] border border-stone-300 bg-parchment sm:h-[520px]">
        <VespaViewerLazy
          explode={explode}
          wireframe={wireframe}
          xray={xray}
          selected={selected}
          onSelect={setSelected}
          glbUrl={glbUrl}
          autoRotate={autoRotate}
        />
        {glbUrl && (
          <div className="absolute top-3 left-3">
            <Badge>GLB: {glbName}</Badge>
          </div>
        )}
      </div>
      {glbUrl && glbCredit && (
        <p className="mt-2 font-mono text-[11px] text-zinc-500">
          3D MODEL: {glbCredit.label.toUpperCase()} BY{" "}
          {glbCredit.author.toUpperCase()} ·{" "}
          {glbCredit.url ? (
            <a
              href={glbCredit.url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-rosso"
            >
              {glbCredit.license} ↗
            </a>
          ) : (
            glbCredit.license.toUpperCase()
          )}
        </p>
      )}

      {/* Selected part detail */}
      {selectedPart && !glbUrl && (
        <p className="mt-4 border border-lagoon bg-parchment px-4 py-3 text-sm">
          <span className="font-medium">{selectedPart.label}</span>
          <span className="text-zinc-600"> — {selectedPart.note} </span>
          <Link href="/parts#fitment" className="underline underline-offset-2">
            Check fitment
          </Link>{" "}
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="underline underline-offset-2"
          >
            Clear selection
          </button>
        </p>
      )}

      {/* Hotspot targets */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VESPA_PARTS.map((p, i) => {
          const active = selected === p.id;
          return (
            <Card
              key={p.id}
              className={active ? "border-racing" : undefined}
            >
              <CardHeader>
                <CardTitle>
                  <button
                    type="button"
                    onClick={() => setSelected(active ? null : p.id)}
                    className="flex items-center text-left"
                    disabled={glbUrl !== null}
                  >
                    <span
                      className={`mr-2 inline-flex h-6 w-6 items-center justify-center text-sm ${
                        active ? "bg-racing text-white" : "bg-racing/15 text-racing"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {p.label}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">{p.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* GLB loader slot */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Licensed model slot</CardTitle>
        </CardHeader>
        <CardContent>
          {probing ? (
            <p className="text-sm text-zinc-600">
              Checking <code>public/models/</code> for a licensed GLB…
            </p>
          ) : foundGlbs.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-600">
                Found in <code>public/models/</code>:
              </span>
              {foundGlbs.map((name) => (
                <Button
                  key={name}
                  type="button"
                  size="sm"
                  variant={glbName === name ? "racing" : "outline"}
                  onClick={() => loadPublicGlb(name)}
                >
                  {name}
                </Button>
              ))}
              {glbUrl && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearGlb}
                >
                  Back to procedural
                </Button>
              )}
            </div>
          ) : glbUrl ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-600">
                Showing uploaded file <strong>{glbName}</strong>. No GLB in{" "}
                <code>public/models/</code> yet — drop one there and reload to
                list it here.
              </span>
              <Button type="button" size="sm" variant="ghost" onClick={clearGlb}>
                Back to procedural
              </Button>
            </div>
          ) : (
            <p className="text-sm text-zinc-600">
              No <code>.glb</code> in <code>public/models/</code> yet — showing
              the procedural stylized Vespa above. Drop a licensed{" "}
              <code>vespa.glb</code> (or <code>body.glb</code>,{" "}
              <code>wheel.glb</code>, <code>scooter.glb</code>) into{" "}
              <code>public/models/</code> and reload, or preview any file now:
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".glb,.gltf"
              className="text-sm"
              aria-label="Load a GLB or glTF file from disk"
              onChange={(e) => onFilePicked(e.target.files?.[0])}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
