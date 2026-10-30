"use client";

import type { VespaPartId } from "@/lib/vespa-inspect";
import {
  GUIDED_QUESTIONS,
  SUBCOMPONENTS,
  subLabel,
  suggestAnswer,
  type SubId,
} from "@/lib/guided-inspect";
import { cn } from "@/lib/utils";

/**
 * Friend-flow detail: the user's own words, one static guided question,
 * and the prepared subcomponent layer. Returns null for assemblies with
 * no prepared content — the app stays silent rather than guessing.
 */
export function GuidedDetail({
  part,
  concern,
  subPart,
  guidedAnswer,
  onAnswer,
  onSelectSub,
}: {
  part: VespaPartId;
  concern?: string;
  subPart?: SubId | null;
  guidedAnswer?: string | null;
  onAnswer: (answerId: string, sub: SubId | null) => void;
  onSelectSub: (sub: SubId | null) => void;
}) {
  const flow = GUIDED_QUESTIONS[part];
  if (!flow) return null;

  const suggestion =
    !guidedAnswer && concern ? suggestAnswer(concern, part) : null;
  const answered = flow.answers.find((a) => a.id === guidedAnswer) ?? null;
  const sub = subPart ? SUBCOMPONENTS[subPart] : null;
  const prepared = Object.values(SUBCOMPONENTS).filter(
    (s) => s.parent === part,
  );

  return (
    <div className="mt-4 border border-line bg-white p-4">
      <p className="font-mono text-[11px] tracking-[0.08em] text-zinc-600">
        CLOSER LOOK
      </p>
      {concern && (
        <p className="mt-2 text-sm text-zinc-700">
          You said: <span className="font-medium">“{concern}”</span>
        </p>
      )}

      <p className="font-grotesk mt-3 font-bold">{flow.question}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {flow.answers.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onAnswer(a.id, a.sub)}
            aria-pressed={guidedAnswer === a.id}
            className={cn(
              "border px-3 py-1.5 text-sm",
              guidedAnswer === a.id
                ? "border-ink bg-ink text-white"
                : "border-line hover:border-ink",
            )}
          >
            {a.label}
            {suggestion === a.id && guidedAnswer !== a.id && (
              <span className="ml-2 font-mono text-[10px] opacity-70">
                suggested
              </span>
            )}
          </button>
        ))}
      </div>
      {answered && (
        <p className="mt-2 text-sm text-zinc-700">{answered.note}</p>
      )}

      <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-zinc-600">
        PREPARED DETAIL
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {prepared.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectSub(subPart === s.id ? null : s.id)}
            aria-pressed={subPart === s.id}
            className={cn(
              "border px-3 py-1.5 font-mono text-xs",
              subPart === s.id
                ? "border-rosso bg-rosso text-white"
                : "border-line hover:border-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      {sub && (
        <div className="mt-2 border-t border-line pt-2">
          <p className="text-sm font-medium">{subLabel(sub.id)}</p>
          <p className="mt-1 text-sm text-zinc-700">{sub.blurb}</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">
            SOURCE: {sub.source}
          </p>
        </div>
      )}
      <p className="mt-2 font-mono text-[11px] text-zinc-500">
        Deeper breakdown (fasteners, adapters) is not prepared — the app
        will not guess it.
      </p>
    </div>
  );
}
