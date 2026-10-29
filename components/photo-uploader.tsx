"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload } from "lucide-react";
import { VESPA_MODELS } from "@/lib/vespa-data";
import {
  downscaleImage,
  newSessionId,
  saveSession,
  suggestFromName,
  type InspectionSession,
} from "@/lib/inspect-session";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLES = [
  { label: "White GTS 300", url: "/frieze/photo-gts.jpg", name: "sample-gts-300.jpg", credit: "Michael Wahrlich · CC0", source: "https://commons.wikimedia.org/wiki/File:Vespa_GTS_300_white.jpg" },
  { label: "1947 Vespa 98", url: "/frieze/photo-v98.jpg", name: "sample-vespa-98.jpg", credit: "Jay Cross · CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:1947_Vespa_98_100cc.jpg" },
  { label: "ET4 detail", url: "/frieze/photo-et4.JPG", name: "sample-et4.jpg", credit: "Späth Chr. · Public domain", source: "https://commons.wikimedia.org/wiki/File:Vespa_ET4_125.JPG" },
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
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

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

  async function inspect() {
    if (!preview) return;
    setWorking(true);
    setError(null);
    try {
      const t0 = performance.now();
      const blob = sampleUrl
        ? await (await fetch(sampleUrl)).blob()
        : await (await fetch(preview)).blob();
      const img = await downscaleImage(blob);
      const hints = suggestFromName(fileName);
      const session: InspectionSession = {
        id: newSessionId(),
        createdAt: new Date().toISOString(),
        imageDataUrl: img.dataUrl,
        fileName,
        manufacturer: "Vespa",
        family: model,
        year,
        status: "matched",
        selectedPart: (selectedPart || null) as InspectionSession["selectedPart"],
        hintPartIds: hints,
        matchNote:
          hints.length > 0
            ? `Local filename heuristic matched ${hints.length} hint(s) — confirm visually.`
            : "No filename hints — confirm the component visually.",
        matchMs: Math.round(performance.now() - t0),
      };
      saveSession(session);
      router.push(`/inspect/${session.id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not read that image — try another.",
      );
      setWorking(false);
    }
  }

  return (
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
          "flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-rosso bg-zinc-100" : "border-line bg-white hover:border-zinc-400",
          preview && "py-6",
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Selected scooter photograph preview"
            className="max-h-64 w-auto border border-line object-contain"
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

      <div className="mt-4">
        <p className="font-mono text-[11px] tracking-[0.1em] text-zinc-600">
          OR TRY A LABELLED SAMPLE
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
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
            onChange={(e) => setModel(e.target.value)}
            className={`${inputCls} mt-1`}
          >
            <option value="">Not sure yet</option>
            {VESPA_MODELS.map((m) => (
              <option key={m.m} value={m.m}>
                {m.m}
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

      <div className="mt-6 border border-zinc-300 bg-white p-4 text-sm">
        <p className="font-medium">For the clearest result</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600">
          <li>Good natural light, component clearly visible.</li>
          <li>Avoid heavy reflections, clutter or cropping the part off.</li>
          <li>Include enough of the scooter to place the component.</li>
        </ul>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-600">
        Stored in this browser only — nothing is uploaded.
      </p>

      {error && (
        <p role="alert" className="mt-4 border border-rosso-deep bg-white px-4 py-3 text-sm text-rosso-deep">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={inspect}
        disabled={!preview || working}
        className={cn(buttonVariants({ size: "lg" }), "mt-5 w-full sm:w-auto")}
      >
        {working ? (
          "Preparing image…"
        ) : (
          <>
            <Upload aria-hidden /> {ctaLabel}
          </>
        )}
      </button>
    </div>
  );
}
