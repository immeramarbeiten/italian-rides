"use client";

import { useState } from "react";
import { Wrench, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { useGarage } from "@/lib/store";

export function MaintenanceGuides() {
  const [guideId, setGuideId] = useState<string>(CATALOG_PARTS[4].id);
  const [done, setDone] = useState<boolean[]>([]);
  const [queuedNote, setQueuedNote] = useState(false);
  const queueJob = useGarage((s) => s.queueJob);
  const guide = CATALOG_PARTS.find((p) => p.id === guideId) ?? CATALOG_PARTS[4];
  const label = VESPA_PARTS.find((v) => v.id === guide.id)?.label ?? guide.id;
  const checked = guide.guide.steps.map((_, i) => done[i] ?? false);
  const doneCount = checked.filter(Boolean).length;

  function pick(id: string) {
    setGuideId(id);
    setDone([]);
    setQueuedNote(false);
  }

  function toggle(i: number) {
    setDone((prev) => {
      const next = [...prev];
      next[i] = !(next[i] ?? false);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a maintenance guide">
        {CATALOG_PARTS.map((p) => {
          const name = VESPA_PARTS.find((v) => v.id === p.id)?.label ?? p.id;
          return (
            <Button
              key={p.id}
              type="button"
              size="sm"
              variant={p.id === guideId ? "default" : "outline"}
              onClick={() => pick(p.id)}
              aria-pressed={p.id === guideId}
            >
              {name}
            </Button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div
          id={`guide-${guide.id}`}
          className="border border-stone-300 bg-white p-5 scroll-mt-20 lg:col-span-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-medium">
              {label} — {guide.guide.title}
            </p>
            <p className="text-sm text-zinc-600 tabular-nums" aria-live="polite">
              {doneCount}/{guide.guide.steps.length} done
            </p>
          </div>
          <ol className="mt-3 space-y-2">
            {guide.guide.steps.map((s, i) => (
              <li key={s.label}>
                <label className="flex cursor-pointer items-start gap-3 border border-stone-300 px-3 py-2 has-checked:bg-parchment">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => toggle(i)}
                    className="mt-1 size-4 accent-verde"
                    aria-label={`Step ${i + 1}: ${s.label}`}
                  />
                  <span>
                    <span className="text-sm font-medium">
                      {i + 1}. {s.label}
                    </span>
                    <span className="block text-sm text-zinc-600">{s.detail}</span>
                  </span>
                </label>
              </li>
            ))}
          </ol>
          {doneCount === guide.guide.steps.length && (
            <p className="mt-3 rounded-full bg-verde px-4 py-2 text-sm text-white">
              Guide complete — log it in the garage to keep the service history.
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={() => {
                queueJob({
                  guideId: guide.id,
                  title: `${label} — ${guide.guide.title}`,
                  scooterId: null,
                });
                setQueuedNote(true);
              }}
            >
              <Plus className="size-4" /> Queue in workshop
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setDone([])}
            >
              <RotateCcw className="size-4" /> Reset checklist
            </Button>
          </div>
          {queuedNote && (
            <p className="mt-2 text-sm text-verde" role="status">
              Queued — find it on the work desk under{" "}
              <a href="/workshop" className="underline">
                /workshop
              </a>
              .
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="border border-stone-300 bg-parchment p-5">
            <p className="flex items-center gap-2 font-medium">
              <Wrench className="size-4" /> Tools
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {guide.guide.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="border border-stone-300 bg-white p-5">
            <p className="font-medium">Torque notes</p>
            <p className="mt-2 text-sm text-zinc-600">{guide.guide.torque}</p>
            <p className="mt-2 font-mono text-[11px] text-zinc-500">
              ILLUSTRATIVE — VERIFY AGAINST THE WORKSHOP MANUAL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
