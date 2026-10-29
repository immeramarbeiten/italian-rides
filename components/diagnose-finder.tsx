"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FAULT_GROUPS, FAULTS, START_OBSERVATIONS } from "@/lib/faults";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { useGarage } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/fig";
import { cn } from "@/lib/utils";

export function DiagnoseFinder() {
  const router = useRouter();
  const scooters = useGarage((s) => s.scooters);
  const addCase = useGarage((s) => s.addCase);
  const [scooterId, setScooterId] = useState("");
  const [group, setGroup] =
    useState<(typeof FAULT_GROUPS)[number]>("Won't start");
  const [obsId, setObsId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const scooter = scooters.find((s) => s.id === scooterId) ?? null;
  const obs =
    START_OBSERVATIONS.find((o) => o.id === obsId) ?? null;

  /** Guided (non-historical) faults for the group, filtered by observation. */
  const guided = FAULTS.filter((f) => {
    if (f.group !== group || f.level === "historical") return false;
    if (group === "Won't start" && obs) return obs.faultIds.includes(f.id);
    return true;
  });
  const historical = FAULTS.filter(
    (f) => f.group === group && f.level === "historical",
  );

  const matches = (modelNames: string[]) =>
    !!scooter && modelNames.includes(scooter.model);

  function createCase() {
    addCase({
      scooterId: scooter?.id ?? null,
      scooterLabel: scooter
        ? `${scooter.model} (${scooter.year})`
        : "Unidentified scooter",
      symptom: group,
      observations: obs ? [obs.label] : [],
      possibleAreas: guided.map((g) => g.cause),
      sources: [...new Set(guided.map((g) => g.source.manual))],
      notes,
    });
    router.push("/workshop");
  }

  return (
    <div>
      <h2 className="font-grotesk text-xl font-bold">
        1 · Which scooter are we helping with?
      </h2>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pick a scooter">
        <button
          type="button"
          onClick={() => setScooterId("")}
          aria-pressed={scooterId === ""}
          className={cn(
            buttonVariants({
              size: "sm",
              variant: scooterId === "" ? "default" : "outline",
            }),
          )}
        >
          General information
        </button>
        {scooters.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScooterId(s.id)}
            aria-pressed={scooterId === s.id}
            className={cn(
              buttonVariants({
                size: "sm",
                variant: scooterId === s.id ? "default" : "outline",
              }),
            )}
          >
            {s.model} ({s.year})
          </button>
        ))}
        <Link
          href="/garage"
          className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
        >
          + Add in garage
        </Link>
      </div>
      {!scooter ? (
        <p className="mt-2 border border-dashed border-line bg-white px-3 py-2 font-mono text-[11px] text-zinc-500">
          MODEL NOT CONFIRMED — GENERAL GUIDANCE ONLY. PICK A SCOOTER FOR
          MODEL-SPECIFIC CHECKS.
        </p>
      ) : (
        <p className="mt-2 font-mono text-[11px] text-zinc-500">
          SCOOTER: {scooter.model.toUpperCase()} · USER-SELECTED, NOT VERIFIED
          AGAINST FRAME NUMBER.
        </p>
      )}

      <h2 className="font-grotesk mt-8 text-xl font-bold">
        2 · What&apos;s it doing?
      </h2>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pick a symptom">
        {FAULT_GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setGroup(g);
              setObsId(null);
            }}
            aria-pressed={group === g}
            className={cn(
              buttonVariants({
                size: "sm",
                variant: group === g ? "default" : "outline",
              }),
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {group === "Won't start" && (
        <>
          <h2 className="font-grotesk mt-8 text-xl font-bold">
            3 · What happens when you try to start it?
          </h2>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pick an observation">
            {START_OBSERVATIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setObsId(o.id)}
                aria-pressed={obsId === o.id}
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: obsId === o.id ? "racing" : "outline",
                  }),
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}

      <h2 className="font-grotesk mt-8 text-xl font-bold">
        {group === "Won't start" ? "4" : "3"} · Possible areas
      </h2>
      {group === "Won't start" && !obs ? (
        <p className="mt-3 max-w-xl text-sm text-zinc-600">
          Pick what you observe above — the checks narrow to what fits.
        </p>
      ) : guided.length === 0 ? (
        <div className="mt-3 max-w-2xl border border-dashed border-line bg-white p-4 text-sm text-zinc-600">
          <p>{obs?.note}</p>
          <p className="mt-2">
            No manual-sourced checks cover this yet. Save it as a workshop
            case below.
          </p>
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {guided.map((f, i) => {
            const part = VESPA_PARTS.find((p) => p.id === f.relatedPart);
            const showValues = matches(f.source.documents);
            return (
              <li
                key={f.id}
                className="grid gap-3 border border-line bg-white p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start"
              >
                <Callout n={i + 1} label={`Possible cause ${i + 1}: ${f.cause}`} />
                <div className="min-w-0">
                  <p className="text-sm text-zinc-500">
                    Possible cause — not confirmed.
                  </p>
                  <p className="font-medium">{f.cause}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                    {showValues ? f.remedy : f.general}
                  </p>
                  {!showValues && (
                    <p className="mt-1 font-mono text-[11px] text-ambra">
                      MODEL-SPECIFIC VALUES LOCKED — DOCUMENTED FOR{" "}
                      {f.source.documents.join(", ").toUpperCase()}.
                    </p>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-zinc-400">
                    SRC — {f.source.manual.toUpperCase()},{" "}
                    {f.source.pages.toUpperCase()} ({f.source.lang.toUpperCase()}
                    )
                  </p>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <Badge variant={f.level === "owner" ? "secondary" : "outline"}>
                    {f.level === "owner" ? "Owner job" : "Dealer job"}
                  </Badge>
                  {part && <Badge variant="outline">{part.label}</Badge>}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {historical.length > 0 && (
        <details className="mt-6 max-w-2xl border border-dashed border-line bg-white text-sm">
          <summary className="cursor-pointer px-4 py-3 font-medium">
            Historical archive ({historical.length}) — not current guidance
          </summary>
          <ul className="space-y-3 border-t border-line px-4 py-3">
            {historical.map((f) => (
              <li key={f.id}>
                <p className="font-medium">{f.cause}</p>
                <p className="mt-0.5 text-zinc-600">{f.remedy}</p>
                <p className="mt-1 font-mono text-[11px] text-zinc-400">
                  SRC — {f.source.manual.toUpperCase()},{" "}
                  {f.source.pages.toUpperCase()} · HISTORICAL, UNREVIEWED FOR
                  CURRENT USE
                </p>
              </li>
            ))}
          </ul>
        </details>
      )}

      <h2 className="font-grotesk mt-8 text-xl font-bold">
        {group === "Won't start" ? "5" : "4"} · Send to the workshop
      </h2>
      <label className="mt-3 block max-w-2xl text-sm">
        <span className="font-medium">Notes for the case (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="e.g. happened twice this week, always when cold"
          className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus:border-rosso focus:outline-none"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={createCase} className={cn(buttonVariants({}))}>
          Create a workshop case <ArrowRight aria-hidden />
        </button>
        <Link href="/inspect" className={cn(buttonVariants({ variant: "outline" }))}>
          Identify parts from a photo
        </Link>
      </div>
    </div>
  );
}
