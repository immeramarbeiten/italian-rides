"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { VESPA_PARTS, type VespaPartId } from "@/lib/vespa-inspect";
import { COMPONENT_INFO } from "@/lib/component-info";
import { ARCHIVE_MODELS } from "@/lib/models";
import { BOUNDED_ACTIONS } from "@/lib/bounded-actions";
import { FAMILIES } from "@/lib/vespa-families";
import {
  confidenceBand,
  getSession,
  saveSession,
  type InspectionSession,
  type SessionStatus,
} from "@/lib/inspect-session";
import { SamOutliner } from "@/components/sam-outliner";
import { GtsPilot } from "@/components/gts-pilot";
import { GuidedDetail } from "@/components/guided-detail";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STEPS: { id: SessionStatus; label: string }[] = [
  { id: "uploaded", label: "Uploaded" },
  { id: "matched", label: "Hints computed" },
  { id: "selected", label: "Selected" },
  { id: "mapped", label: "Mapped" },
];

export function InspectWorkspace() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<InspectionSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [unidentified, setUnidentified] = useState(false);

  useEffect(() => {
    setSession(getSession(params.sessionId));
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

  const stepIdx = STEPS.findIndex((s) => s.id === session.status);
  const selected = session.selectedPart
    ? VESPA_PARTS.find((p) => p.id === session.selectedPart)
    : null;
  const slug =
    ARCHIVE_MODELS.find((m) => m.m === session.family)?.slug ??
    ARCHIVE_MODELS.find(
      (m) =>
        m.m === FAMILIES.find((f) => f.label === session.family)?.archive,
    )?.slug;
  const mapped = session.status === "mapped";
  const ai = session.ai ?? null;
  const action = selected ? (BOUNDED_ACTIONS[selected.id] ?? null) : null;

  function select(id: VespaPartId | null) {
    setUnidentified(false);
    update({
      selectedPart: id,
      status: id ? "selected" : "matched",
      subPart: null,
      guidedAnswer: null,
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <Link
          href="/inspect"
          className="inline-flex items-center gap-1 font-mono text-xs text-zinc-600 hover:text-rosso"
        >
          <ArrowLeft className="size-4" aria-hidden /> INSPECT
        </Link>
        <span className="font-mono text-xs text-zinc-500">
          {session.family || "Unknown model"}
          {session.engine ? ` ${session.engine}` : ""}
          {session.year ? ` · ${session.year}` : ""} · {session.fileName}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <Badge variant={mapped ? "default" : "secondary"}>
            {STEPS[stepIdx]?.label ?? session.status}
          </Badge>
          <Link
            href="/inspect"
            className="font-mono text-xs text-rosso underline underline-offset-2"
          >
            Replace image
          </Link>
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.65fr_1fr]">
        <div className="min-w-0">
          <SamOutliner
            imageDataUrl={session.imageDataUrl}
            fileName={session.fileName}
            hints={(ai?.components ?? [])
              .slice(0, 3)
              .map((c) => ({ id: c.id, label: c.label }))}
            initial={session.sam ?? null}
            onSave={(sam) => update({ sam, pilotSelection: null })}
          />
          <GtsPilot session={session} onConfirm={(pilotSelection) => update({ pilotSelection })} />
        </div>

        <div className="min-w-0">
          <ol className="flex gap-1" aria-label="Recognition progress">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i <= stepIdx ? "bg-rosso" : "bg-line",
                )}
                title={s.label}
              />
            ))}
          </ol>
          <p className="mt-2 text-xs text-zinc-600">{session.matchNote}</p>

          {!mapped ? (
            <>
              <h2 className="font-grotesk mt-5 text-lg font-bold">
                What do you see?
              </h2>
              <ul className="mt-3 space-y-2">
                {VESPA_PARTS.map((p) => {
                  const active = session.selectedPart === p.id;
                  const hinted = session.hintPartIds.includes(p.id);
                  const partConf = ai?.components.find(
                    (c) => c.id === p.id,
                  )?.confidence;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => select(active ? null : p.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors",
                          active
                            ? "border-ink bg-zinc-100"
                            : "border-line bg-white hover:border-zinc-400",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 shrink-0 items-center justify-center",
                            active ? "bg-rosso text-white" : "bg-zinc-100 text-ink",
                          )}
                        >
                          {active && <Check className="size-4" aria-hidden />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">
                            {p.label}
                            {hinted && (
                              <span className="ml-2 font-mono text-[10px] text-zinc-500">
                                {partConf !== undefined
                                  ? `AI · ${confidenceBand(partConf)}`
                                  : "filename hint"}
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-zinc-500">
                            {p.note}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setUnidentified(true);
                  update({
                    selectedPart: null,
                    status: "matched",
                    subPart: null,
                    guidedAnswer: null,
                  });
                }}
                className="mt-3 font-mono text-xs text-zinc-500 underline underline-offset-2 hover:text-rosso"
              >
                Component not identifiable
              </button>
              {unidentified && (
                <p className="mt-2 border border-dashed border-line px-3 py-2 text-sm text-zinc-600">
                  No confident match — try another angle, or browse the{" "}
                  <Link href="/archive" className="underline hover:text-rosso">
                    archive
                  </Link>{" "}
                  instead. The system will not guess.
                </p>
              )}
              {selected && (
                <div className="mt-4 border border-line bg-white p-4">
                  <p className="font-grotesk font-bold">{selected.label}</p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-500">
                    {selected.id} · {COMPONENT_INFO[selected.id].assembly.toUpperCase()}
                  </p>
                  <button
                    type="button"
                    onClick={() => update({ status: "mapped" })}
                    className={cn(buttonVariants({}), "mt-3 w-full")}
                  >
                    Confirm this component <Check aria-hidden />
                  </button>
                </div>
              )}
            </>
          ) : (
            selected && (
              <div className="mt-5 border border-line bg-white p-5">
                <Badge variant="default">Mapped ✓</Badge>
                <p className="font-grotesk mt-2 text-xl font-bold">
                  {selected.label}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  {COMPONENT_INFO[selected.id].function.split(". ")[0]}.
                </p>
                {action && (
                  <div className="mt-4 border border-line bg-parchment p-4">
                    <p className="font-mono text-[11px] tracking-[0.08em] text-zinc-600">
                      {action.mode === "owner-check"
                        ? "OWNER CHECK"
                        : "NOTE + MECHANIC REFERRAL"}
                    </p>
                    <p className="font-grotesk mt-1 font-bold">{action.title}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                      {action.lines.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                    <p className="mt-2 border-t border-line pt-2 font-mono text-[11px] text-zinc-500">
                      SOURCE: {action.source}
                    </p>
                  </div>
                )}
                <GuidedDetail
                  part={selected.id}
                  concern={session.concern}
                  subPart={session.subPart ?? null}
                  guidedAnswer={session.guidedAnswer ?? null}
                  onAnswer={(guidedAnswer, subPart) =>
                    update({ guidedAnswer, subPart })
                  }
                  onSelectSub={(subPart) => update({ subPart })}
                />
                <div className="mt-4 space-y-2">
                  {slug ? (
                    <Link
                      href={`/models/${slug}/viewer?component=${selected.id}`}
                      className={cn(buttonVariants({}), "w-full")}
                    >
                      Show in 3D <ArrowRight aria-hidden />
                    </Link>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Confirm the model above to unlock the 3D link — or{" "}
                      <Link href="/archive" className="underline hover:text-rosso">
                        browse the archive
                      </Link>
                      .
                    </p>
                  )}
                  <Link
                    href={`/repairs/${selected.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    Explore repair information
                  </Link>
                  <Link
                    href={`/garage?from=${session.id}`}
                    className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                  >
                    Record in My Garage
                  </Link>
                </div>
              </div>
            )
          )}

          <details className="mt-6 border border-line bg-white text-sm">
            <summary className="cursor-pointer px-4 py-3 font-mono text-xs text-zinc-600">
              TECHNICAL DETAILS
            </summary>
            <dl className="space-y-2 border-t border-line px-4 py-3 font-mono text-xs text-zinc-600">
              <div className="flex justify-between gap-4">
                <dt>Matcher</dt>
                <dd className="text-right">
                  {ai ? `${ai.model} (Meta Model API)` : "local-filename-heuristic v0"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>External AI</dt>
                <dd className="text-right">
                  {ai ? "connected — one identification call" : "not connected"}
                </dd>
              </div>
              {ai?.modelGuess && (
                <div className="flex justify-between gap-4">
                  <dt>Model guess</dt>
                  <dd className="text-right">{ai.modelGuess}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt>Segmentation</dt>
                <dd className="text-right">
                  {session.sam
                    ? `SAM 3.1 · ${session.sam.matches.length} mask${session.sam.matches.length === 1 ? "" : "s"} · side ${session.sam.side || "?"}`
                    : "tap the photo to outline"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Prepare time</dt>
                <dd className="text-right">{session.matchMs} ms (this device)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Component id</dt>
                <dd className="text-right">{session.selectedPart ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Created</dt>
                <dd className="text-right">{new Date(session.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </details>
        </div>
      </div>
    </div>
  );
}
