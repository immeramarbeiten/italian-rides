"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload } from "lucide-react";
import {
  FAMILIES,
  engineOptions,
  plausibilityWarning,
} from "@/lib/vespa-families";
import type { VespaPartId } from "@/lib/vespa-inspect";
import {
  clearInspections,
  confidenceBand,
  downscaleImage,
  newSessionId,
  parseAiResult,
  saveSession,
  suggestFromName,
  type AiResult,
  type InspectionSession,
} from "@/lib/inspect-session";
import { buttonVariants } from "@/components/ui/button";
import { VoiceConcern } from "@/components/voice-concern";
import { cn } from "@/lib/utils";

const SAMPLES = [
  { label: "GTS 300 · front", url: "/frieze/sample-gts-front.jpg", name: "sample-gts-front.jpg", credit: "Cropped from Michael Wahrlich · CC0", source: "https://commons.wikimedia.org/wiki/File:Vespa_GTS_300_white.jpg" },
  { label: "GTS 300 · drive side", url: "/frieze/sample-gts-drive.jpg", name: "sample-gts-drive.jpg", credit: "Cropped from Michael Wahrlich · CC0", source: "https://commons.wikimedia.org/wiki/File:Vespa_GTS_300_white.jpg" },
  { label: "Elettrica · front", url: "/frieze/sample-elettrica-front.jpg", name: "sample-elettrica-front.jpg", credit: "Cropped from Corvettec6r · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Piaggio_Vespa_Elettrica.jpg" },
];

const FIXTURES = [
  { label: "Rusty exhaust", url: "/fixtures/damage-rusty-exhaust.png", name: "fixture-rusty-exhaust.png" },
  { label: "Mirror · simulated crack", url: "/fixtures/ai-gts-mirror-cracked-simulated-v2.png", name: "ai-fixture-mirror-cracked-simulated.png" },
  { label: "Front tyre · simulated wear", url: "/fixtures/ai-gts-front-tyre-worn-simulated-v2.png", name: "ai-fixture-front-tyre-worn-simulated.png" },
  { label: "Dented cowl", url: "/fixtures/damage-dented-cowl.png", name: "fixture-dented-cowl.png" },
  { label: "Scored disc", url: "/fixtures/damage-scored-disc.png", name: "fixture-scored-disc.png" },
  { label: "Corroded battery", url: "/fixtures/damage-corroded-battery.png", name: "fixture-corroded-battery.png" },
  { label: "Mirror · no visible damage", url: "/fixtures/healthy-mirror.png", name: "fixture-healthy-mirror.png" },
  { label: "Front tyre · no visible damage", url: "/fixtures/healthy-tyre.png", name: "fixture-healthy-tyre.png" },
];

const MAX_BYTES = 15 * 1024 * 1024;

const inputCls =
  "w-full border border-line bg-white px-3 py-2 text-sm focus:border-rosso focus:outline-none";

export function PhotoUploader({
  initialModel,
  selectedPart,
  ctaLabel = "Inspect photograph",
}: {
  initialModel: string;
  selectedPart: string;
  ctaLabel?: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [sampleUrl, setSampleUrl] = useState<string | null>(null);
  const [model, setModel] = useState(initialModel);
  const [engine, setEngine] = useState("");
  const [year, setYear] = useState("");
  const [concern, setConcern] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);

  const engines = engineOptions(model);
  const yearWarning = model || year ? plausibilityWarning(model, year) : null;

  function onFamilyChange(v: string) {
    setModel(v);
    setEngine((prev) =>
      prev && engineOptions(v).includes(prev) ? prev : "",
    );
  }

  function pickFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image — pick a JPG, PNG or HEIC photo.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is over 15 MB — pick a smaller one.");
      return;
    }
    setSampleUrl(null);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function pickSample(url: string, name: string) {
    setError(null);
    setSampleUrl(url);
    setFileName(name);
    setPreview(url);
    if (fileRef.current) fileRef.current.value = "";
  }

  /** AI result, "unavailable" without a key, or null on any failure. */
  async function identify(
    dataUrl: string,
    concernText: string,
  ): Promise<AiResult | "unavailable" | null> {
    try {
      const res = await fetch("/api/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, concern: concernText }),
      });
      if (res.status === 503) return "unavailable";
      if (!res.ok) return null;
      const data = (await res.json()) as { model?: unknown; result?: unknown };
      return parseAiResult(
        data.result,
        typeof data.model === "string" ? data.model : "unknown model",
      );
    } catch {
      return null;
    }
  }

  async function clearAndRetry() {
    setStorageBlocked(false);
    setError(null);
    if (!clearInspections()) {
      setError(
        "Storage is blocked in this browser (private window or site settings) — allow it and retry.",
      );
      return;
    }
    await inspect(true);
  }

  async function inspect(retried = false) {
    if (!preview) return;
    setWorking(true);
    setError(null);
    try {
      const t0 = performance.now();
      const blob = sampleUrl
        ? await (await fetch(sampleUrl)).blob()
        : await (await fetch(preview)).blob();
      const img = await downscaleImage(blob);
      const concernText = concern.trim().slice(0, 200);
      const found = await identify(img.dataUrl, concernText);
      const ai = found !== null && found !== "unavailable" ? found : null;
      const hints: VespaPartId[] =
        ai && ai.components.length > 0
          ? ai.components.map((c) => c.id as VespaPartId)
          : suggestFromName(fileName);
      const seen = ai
        ? ai.components
            .slice(0, 3)
            .map((c) => `${c.label} (${confidenceBand(c.confidence)})`)
            .join(", ")
        : "";
      const fullView = ai !== null && ai.components.length >= 5;
      const matchNote =
        ai && ai.components.length > 0
          ? `${fullView ? "Full view — everything visible; " : ""}AI (${ai.model}) sees ${seen} — confirm visually.${ai.modelGuess ? ` Model guess: ${ai.modelGuess}.` : ""}`
          : ai
            ? "AI found no recognizable component — filename hints only — confirm visually."
            : found === "unavailable"
              ? `AI unavailable (API key missing) — ${hints.length > 0 ? "filename hints only" : "no filename hints"} — confirm visually.`
              : `AI call failed — ${hints.length > 0 ? "filename hints only" : "no filename hints"} — confirm visually.`;
      const session: InspectionSession = {
        id: newSessionId(),
        createdAt: new Date().toISOString(),
        imageDataUrl: img.dataUrl,
        fileName,
        manufacturer: "Vespa",
        family: model,
        engine,
        year,
        status: "matched",
        selectedPart: (selectedPart || null) as InspectionSession["selectedPart"],
        hintPartIds: hints,
        matchNote,
        matchMs: Math.round(performance.now() - t0),
        ai,
        ...(concernText ? { concern: concernText } : {}),
      };
      const saved = saveSession(session);
      if (!saved.ok) {
        if (retried) {
          setError(
            "Still blocked after clearing — check for a private window or site storage settings, then retry.",
          );
        } else {
          setStorageBlocked(true);
          setError(
            "This browser refused to store the inspection (storage full or blocked) — free some space and retry.",
          );
        }
        setWorking(false);
        return;
      }
      router.push(`/inspect/${session.id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not read that image — try another.",
      );
      setWorking(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
      <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload a scooter photograph"
        className={cn(
          "flex min-h-[300px] cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-8 text-center transition-colors lg:min-h-[420px]",
          dragging ? "border-rosso bg-zinc-100" : "border-line bg-white hover:border-zinc-400",
          preview && "py-6",
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Selected scooter photograph preview"
            className="max-h-[48vh] w-auto object-contain"
          />
        ) : (
          <>
            <Camera className="size-8 text-zinc-400" aria-hidden />
            <p className="font-grotesk mt-3 text-xl font-bold">
              Drop a scooter photo here
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              or tap to browse — on mobile you can take one on the spot
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>
      {preview && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="truncate font-mono text-xs text-zinc-500">
            {fileName}
            {(() => {
              if (FIXTURES.some((s) => s.url === sampleUrl)) {
                return <> · AI-generated test fixture</>;
              }
              const sample = SAMPLES.find((s) => s.url === sampleUrl);
              return sample ? (
                <>
                  {" "}· ©{" "}
                  <a
                    href={sample.source}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-rosso"
                  >
                    {sample.credit} ↗
                  </a>
                </>
              ) : null;
            })()}
          </p>
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setSampleUrl(null);
              setFileName("");
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="font-mono text-xs text-rosso underline underline-offset-2"
          >
            Replace
          </button>
        </div>
      )}

      <details className="mt-3" open={!preview}>
        <summary className="cursor-pointer text-sm font-medium">Try a sample photograph</summary>
        <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-zinc-600">
          LABELLED SAMPLES
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s.url}
              type="button"
              onClick={() => pickSample(s.url, s.name)}
              aria-pressed={sampleUrl === s.url}
              className={cn(
                "border bg-white text-left transition-colors hover:border-ink",
                sampleUrl === s.url ? "border-ink" : "border-line",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.url}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="block px-2 py-1.5 text-xs font-medium">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </details>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium">Try a simulated example</summary>
        <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-zinc-600">
          AI-GENERATED FIXTURES
        </p>
        <p className="mt-1 text-xs text-zinc-600">Simulated examples: details and damage are invented, and do not establish a component’s condition or exact vehicle fit.</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {FIXTURES.map((s) => (
            <button
              key={s.url}
              type="button"
              onClick={() => pickSample(s.url, s.name)}
              aria-pressed={sampleUrl === s.url}
              className={cn(
                "border bg-white text-left transition-colors hover:border-ink",
                sampleUrl === s.url ? "border-ink" : "border-line",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.url}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full bg-zinc-100 object-contain"
              />
              <span className="block px-2 py-1.5 text-xs font-medium">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </details>
      </div>

      <div className="border border-zinc-200 bg-white p-5">
      <p className="text-xs font-medium text-zinc-500">YOUR SCOOTER</p>
      <h2 className="mt-1 text-xl font-semibold">Tell us what you know</h2>
      <p className="mt-1 text-sm text-zinc-600">All fields are optional. You can change them later.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Manufacturer</span>
          <select className={`${inputCls} mt-1`} defaultValue="Vespa" aria-label="Manufacturer">
            <option>Vespa</option>
            <option disabled>Peugeot — soon</option>
            <option disabled>Lambretta — soon</option>
            <option disabled>Yamaha — soon</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Model family</span>
          <select
            value={model}
            onChange={(e) => onFamilyChange(e.target.value)}
            className={`${inputCls} mt-1`}
          >
            <option value="">Not sure yet</option>
            {FAMILIES.map((f) => (
              <option key={f.label} value={f.label}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Engine (cc)</span>
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className={`${inputCls} mt-1`}
          >
            <option value="">Not sure yet</option>
            {engines.map((e) => (
              <option key={e} value={e}>
                {e === "Electric" ? "Electric" : `${e} cc`}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Year (if known)</span>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 1979"
            inputMode="numeric"
            className={`${inputCls} mt-1`}
          />
        </label>
      </div>

      <div className="mt-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="concern-input" className="font-medium">
            Something wrong? (optional)
          </label>
          <VoiceConcern onTranscript={(t) => setConcern(t.slice(0, 200))} />
        </div>
        <input
          id="concern-input"
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          placeholder="e.g. my mirror is loose — or say it"
          maxLength={200}
          className={`${inputCls} mt-1`}
        />
      </div>

      {yearWarning && (
        <p
          role="note"
          className="mt-3 border border-amber-500 bg-amber-50 px-4 py-2 text-sm text-amber-900"
        >
          {yearWarning}
        </p>
      )}

      <details className="mt-4 border-t border-zinc-200 pt-3 text-sm">
        <summary className="cursor-pointer font-medium">Tips for a clear photo</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600">
          <li>Good natural light, component clearly visible.</li>
          <li>Avoid heavy reflections, clutter or cropping the part off.</li>
          <li>Include enough of the scooter to place the component.</li>
        </ul>
      </details>
      <p className="mt-3 text-xs leading-relaxed text-zinc-600">
        Photo, words, and any voice clip above go to the Meta Model API —
        EXIF-stripped. A copy stays in this browser only; we cannot verify
        the provider&apos;s retention.
      </p>

      {error && (
        <p role="alert" className="mt-4 border border-rosso-deep bg-white px-4 py-3 text-sm text-rosso-deep">
          {error}
        </p>
      )}
      {storageBlocked && (
        <button
          type="button"
          onClick={() => void clearAndRetry()}
          className="mt-2 border border-ink bg-white px-4 py-2 font-mono text-xs hover:bg-zinc-100"
        >
          Delete stored inspections and retry
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setStorageBlocked(false);
          void inspect();
        }}
        disabled={!preview || working}
        className={cn(buttonVariants({ size: "lg" }), "mt-5 w-full sm:w-auto")}
      >
        {working ? (
          "Identifying component…"
        ) : (
          <>
            <Upload aria-hidden /> {ctaLabel}
          </>
        )}
      </button>
      </div>
    </div>
  );
}
