"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MaintenanceGuide } from "@/lib/vespa-parts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProcedureStepper({
  guide,
  exitHref,
}: {
  guide: MaintenanceGuide;
  exitHref: string;
}) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const step = guide.steps[idx];
  const total = guide.steps.length;

  if (done) {
    return (
      <div className="border border-line bg-white p-6 sm:p-8">
        <p className="font-mono text-[11px] tracking-[0.14em] text-verde">
          PROCEDURE COMPLETE — PENDING YOUR CONFIRMATION
        </p>
        <h2 className="font-grotesk mt-2 text-2xl font-bold">
          Did the work actually get done?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-600">
          Nothing is marked complete until you say so. Add a note for your
          future self, then file it with the scooter.
        </p>
        <label className="mt-4 block max-w-xl text-sm">
          <span className="font-medium">Workshop note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. left cowl rubber perished — ordered a pair"
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm focus:border-rosso focus:outline-none"
          />
        </label>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="size-4 accent-verde"
          />
          I completed this work myself
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          {confirmed ? (
            <Link href="/garage" className={cn(buttonVariants({}))}>
              Record in My Garage <ArrowRight aria-hidden />
            </Link>
          ) : (
            <span
              className={cn(buttonVariants({}), "cursor-not-allowed opacity-50")}
              aria-disabled="true"
            >
              Record in My Garage <ArrowRight aria-hidden />
            </span>
          )}
          <Link href={exitHref} className={cn(buttonVariants({ variant: "outline" }))}>
            Exit procedure
          </Link>
        </div>
        {note && (
          <p className="mt-4 max-w-xl border border-dashed border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-600">
            Your note: {note}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="border border-zinc-300 bg-zinc-100 p-8 sm:p-10">
          <p className="font-grotesk text-6xl font-black tracking-tight text-ink/15">
            {String(idx + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-zinc-500">
            REFERENCE ASSEMBLY — PX PATTERN. YOUR VARIANT MAY DIFFER.
          </p>
        </div>
        <div className="border border-line bg-white p-6">
          <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
            STEP {idx + 1} OF {total}
          </p>
          <h3 className="font-grotesk mt-2 text-2xl font-bold">{step.label}</h3>
          <p className="mt-3 text-[15px] leading-[1.7] text-zinc-700">
            {step.detail}
          </p>
          <p className="mt-4 font-mono text-[11px] text-zinc-500">
            ILLUSTRATIVE — CONFIRM AGAINST THE WORKSHOP MANUAL
          </p>
        </div>
      </div>
      <div className="mt-4 h-1.5 bg-line" role="progressbar" aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={total} aria-label="Procedure progress">
        <div
          className="h-full bg-rosso transition-all"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeft aria-hidden /> Previous
        </button>
        {idx < total - 1 ? (
          <button type="button" onClick={() => setIdx((i) => i + 1)} className={cn(buttonVariants({}))}>
            Next <ArrowRight aria-hidden />
          </button>
        ) : (
          <button type="button" onClick={() => setDone(true)} className={cn(buttonVariants({ variant: "racing" }))}
          >
            Finish procedure
          </button>
        )}
        <Link href={exitHref} className={cn(buttonVariants({ variant: "ghost" }))}>
          Exit
        </Link>
      </div>
    </div>
  );
}
