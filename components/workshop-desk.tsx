"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { VESPA_MODELS } from "@/lib/vespa-data";
import { slugify } from "@/lib/models";
import { useGarage, type CaseStatus, type JobStatus } from "@/lib/store";

const COLUMNS: { id: JobStatus; title: string }[] = [
  { id: "queued", title: "Queued" },
  { id: "active", title: "On the lift" },
  { id: "done", title: "Done" },
];

const NEXT: Record<JobStatus, JobStatus | null> = {
  queued: "active",
  active: "done",
  done: null,
};

const CASE_NEXT: Record<CaseStatus, CaseStatus | null> = {
  open: "ready",
  ready: "referred",
  referred: "resolved",
  resolved: null,
};

const CASE_LABEL: Record<CaseStatus, string> = {
  open: "Not diagnosed",
  ready: "Ready for inspection",
  referred: "Referred",
  resolved: "Resolved",
};

/** All six guides are PX-pattern classics — say so, don't imply universal. */
const GUIDE_SCOPE = "Geared classics · PX-pattern (illustrative)";

const isModern = (model: string) =>
  /GTS|ET4|946|Elettrica/i.test(model);

export function WorkshopDesk() {
  const {
    jobs,
    queueJob,
    setJobStatus,
    removeJob,
    scooters,
    cases,
    setCaseStatus,
    removeCase,
    serviceLog,
    importAll,
  } = useGarage();
  const [guideId, setGuideId] = useState<string>(CATALOG_PARTS[4].id);
  const [scooterId, setScooterId] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = scooters.find((s) => s.id === scooterId) ?? null;
  const selectedModel = selected
    ? VESPA_MODELS.find((m) => m.m === selected.model)
    : null;

  const scooterName = (id: string | null, fallback: string) =>
    id ? (scooters.find((s) => s.id === id)?.model ?? fallback) : fallback;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const part = CATALOG_PARTS.find((p) => p.id === guideId);
    if (!part) return;
    const label = VESPA_PARTS.find((v) => v.id === part.id)?.label ?? part.id;
    queueJob({
      guideId: part.id,
      title: `${label} — ${part.guide.title}`,
      scooterId: scooterId || null,
    });
  }

  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ scooters, serviceLog, jobs, cases }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "italian-rides-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importData(file: File | undefined) {
    setImportError(null);
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.scooters)) throw new Error("bad file");
      importAll({
        scooters: data.scooters,
        serviceLog: data.serviceLog ?? [],
        jobs: data.jobs ?? [],
        cases: data.cases ?? [],
      });
    } catch {
      setImportError("That file isn't a valid backup — nothing was changed.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      {cases.length > 0 && (
        <section aria-label="Diagnostic cases" className="mt-6">
          <h3 className="font-display text-lg">
            Cases{" "}
            <span className="text-sm text-zinc-500 tabular-nums">
              ({cases.length})
            </span>
          </h3>
          <div className="mt-2 space-y-3">
            {cases.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {c.symptom} — {scooterName(c.scooterId, c.scooterLabel)}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{CASE_LABEL[c.status]}</Badge>
                    <Badge variant="outline">
                      {c.observations.length} observation
                      {c.observations.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {c.observations.length > 0 && (
                    <p className="text-sm text-zinc-600">
                      Observed: {c.observations.join("; ")}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-zinc-600">
                    Possible areas: {c.possibleAreas.join(" · ") || "—"}
                  </p>
                  {c.sources.length > 0 && (
                    <p className="mt-1 font-mono text-[11px] text-zinc-400">
                      SRC — {c.sources.join(" · ").toUpperCase()}
                    </p>
                  )}
                  {c.notes && (
                    <p className="mt-1 text-sm text-zinc-600">
                      Notes: {c.notes}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CASE_NEXT[c.status] && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setCaseStatus(c.id, CASE_NEXT[c.status] as CaseStatus)
                        }
                      >
                        Mark {CASE_LABEL[CASE_NEXT[c.status] as CaseStatus]}{" "}
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCase(c.id)}
                      aria-label={`Delete case ${c.symptom}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <form
        onSubmit={submit}
        className="mt-6 grid gap-3 border border-stone-300 bg-white p-5 sm:grid-cols-3"
      >
        <label className="block text-sm">
          <span className="font-medium">Maintenance guide</span>
          <select
            value={guideId}
            onChange={(e) => setGuideId(e.target.value)}
            className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-sm focus:border-lagoon focus:outline-none"
          >
            {CATALOG_PARTS.map((p) => (
              <option key={p.id} value={p.id}>
                {VESPA_PARTS.find((v) => v.id === p.id)?.label} —{" "}
                {p.guide.title}
              </option>
            ))}
          </select>
          <span className="mt-1 block font-mono text-[11px] text-zinc-500">
            {GUIDE_SCOPE.toUpperCase()}
          </span>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Scooter (optional)</span>
          <select
            value={scooterId}
            onChange={(e) => setScooterId(e.target.value)}
            className="mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-sm focus:border-lagoon focus:outline-none"
          >
            <option value="">Unassigned</option>
            {scooters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.model} ({s.year})
              </option>
            ))}
          </select>
          {selected && isModern(selected.model) && (
            <span className="mt-1 block font-mono text-[11px] text-ambra">
              PX-PATTERN GUIDE ON A MODERN SCOOTER — VERIFY AGAINST ITS MANUAL.
            </span>
          )}
        </label>
        <div className="flex items-end">
          <Button type="submit" size="sm">
            <Plus className="size-4" /> Queue job
          </Button>
        </div>
      </form>

      {selected && selectedModel && (
        <div className="mt-3 border border-line bg-white p-4 text-sm">
          <p className="font-grotesk font-bold">Your model — {selected.model}</p>
          <p className="mt-1 text-zinc-600">
            {selectedModel.engine} · {selectedModel.y} ·{" "}
            {selectedModel.factory}
          </p>
          <Link
            href={`/models/${slugify(selected.model)}`}
            className="mt-1 inline-block font-medium text-rosso underline underline-offset-2"
          >
            Open model page
          </Link>
        </div>
      )}

      <p className="mt-2 text-sm text-zinc-500">
        Or queue a guide straight from the{" "}
        <Link href="/parts" className="underline">
          parts guides
        </Link>{" "}
        — queued jobs land here. Jobs persist in local storage.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={exportData}>
          <Download className="size-4" /> Export backup
        </Button>
        <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" /> Import backup
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(e) => importData(e.target.files?.[0])}
        />
      </div>
      {importError && (
        <p role="alert" className="mt-2 text-sm text-rosso-deep">
          {importError}
        </p>
      )}
      <p className="mt-2 font-mono text-[11px] text-zinc-500">
        SAVED IN THIS BROWSER ON THIS DEVICE. EXPORT A COPY BEFORE CLEARING
        BROWSER DATA OR CHANGING DEVICES.
      </p>

      {jobs.length === 0 ? (
        <p className="mt-6 border border-dashed border-stone-300 bg-parchment px-4 py-6 text-center text-sm text-zinc-500">
          The desk is clear — queue a maintenance guide above to start a job
          card.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const cards = jobs.filter((j) => j.status === col.id);
            return (
              <section key={col.id} aria-label={col.title}>
                <h3 className="font-display text-lg">
                  {col.title}{" "}
                  <span className="text-sm text-zinc-500 tabular-nums">
                    ({cards.length})
                  </span>
                </h3>
                <div className="mt-2 space-y-3">
                  {cards.map((j) => (
                    <Card
                      key={j.id}
                      className={col.id === "active" ? "border-racing" : ""}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">
                          {j.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary">
                            {scooterName(j.scooterId, "Unassigned")}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              col.id === "done" ? "border-verde text-verde" : ""
                            }
                          >
                            {col.title}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Link
                          href={`/parts#guide-${j.guideId}`}
                          className="text-xs underline"
                        >
                          Open guide
                        </Link>
                        <span className="ml-auto flex gap-2">
                          {NEXT[col.id] && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setJobStatus(j.id, NEXT[col.id] as JobStatus)
                              }
                            >
                              {col.id === "queued" ? "Start" : "Finish"}{" "}
                              <ArrowRight className="size-3.5" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeJob(j.id)}
                            aria-label={`Delete job ${j.title}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                  {cards.length === 0 && (
                    <p className="border border-dashed border-stone-300 px-3 py-4 text-center text-xs text-zinc-500">
                      Nothing {col.id === "queued" ? "waiting" : col.id}.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
