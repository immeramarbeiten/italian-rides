"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import {
  CATALOG_PARTS,
  FITMENT_COLUMNS,
  type FitStatus,
} from "@/lib/vespa-parts";

const CELL: Record<FitStatus, { glyph: string; label: string; cls: string }> = {
  fit: { glyph: "●", label: "Fits", cls: "text-verde" },
  adapt: { glyph: "◐", label: "Adapts", cls: "text-ambra" },
  no: { glyph: "○", label: "No fit", cls: "text-stone-400" },
};

export function FitmentMatrix() {
  const [focusId, setFocusId] = useState<string>(CATALOG_PARTS[0].id);
  const focus = CATALOG_PARTS.find((p) => p.id === focusId) ?? CATALOG_PARTS[0];
  const focusLabel = VESPA_PARTS.find((v) => v.id === focus.id)?.label;

  return (
    <div>
      <p className="mb-3 border border-amber-500 bg-amber-50 px-4 py-2 font-mono text-xs text-amber-900">
        UNVERIFIED DATA — PATTERNS ONLY, NOT FITMENT CLAIMS. CONFIRM EVERY PART
        AGAINST YOUR MANUAL.
      </p>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a part row">
        {CATALOG_PARTS.map((p) => {
          const label = VESPA_PARTS.find((v) => v.id === p.id)?.label ?? p.id;
          return (
            <Button
              key={p.id}
              type="button"
              size="sm"
              variant={p.id === focusId ? "default" : "outline"}
              onClick={() => setFocusId(p.id)}
              aria-pressed={p.id === focusId}
            >
              {label}
            </Button>
          );
        })}
      </div>

      <div className="mt-4 border border-stone-300 bg-white p-5">
        <p className="font-medium">
          {focusLabel} — {focus.item}
        </p>
        <p className="mt-1 text-sm text-zinc-600">{focus.blurb}</p>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {focus.fitment.map((cell, i) => {
            const col = FITMENT_COLUMNS[i];
            const c = CELL[cell.fit];
            return (
              <div key={col.model} className="flex items-start gap-2">
                <span className={c.cls} aria-hidden="true">{c.glyph}</span>
                <div>
                  <dt className="font-medium">
                    {col.model}{" "}
                    <span className="font-normal text-zinc-600">({col.years})</span>
                  </dt>
                  <dd className="text-zinc-600">
                    {c.label}
                    {cell.note ? ` — ${cell.note}` : ""}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-600">Sources:</span>
          {focus.sources.map((s) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
          <Link
            href={`/inspect?part=${focus.id}`}
            className="ml-auto text-sm text-lagoon underline underline-offset-2"
          >
            See it on the 3D model
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-stone-300 bg-white">
        <table className="w-full min-w-200 border-collapse text-sm">
          <caption className="px-4 py-2 text-left font-medium">
            Full matrix — catalog part × model
          </caption>
          <thead>
            <tr className="bg-parchment">
              <th scope="col" className="border-b border-stone-300 px-3 py-2 text-left font-medium">
                Part
              </th>
              {FITMENT_COLUMNS.map((c) => (
                <th
                  key={c.model}
                  scope="col"
                  className="border-b border-stone-300 px-2 py-2 text-center font-medium"
                  title={`${c.model} (${c.years})`}
                >
                  {c.years}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATALOG_PARTS.map((p) => {
              const label = VESPA_PARTS.find((v) => v.id === p.id)?.label ?? p.id;
              return (
                <tr key={p.id}>
                  <th scope="row" className="border-b border-stone-200 px-3 py-2 text-left font-normal">
                    <button
                      type="button"
                      className="underline underline-offset-2"
                      onClick={() => setFocusId(p.id)}
                      title={p.item}
                    >
                      {label}
                    </button>
                  </th>
                  {p.fitment.map((cell, i) => {
                    const c = CELL[cell.fit];
                    const col = FITMENT_COLUMNS[i];
                    return (
                      <td
                        key={col.model}
                        className="border-b border-stone-200 px-2 py-2 text-center"
                        title={`${c.label}${cell.note ? ` — ${cell.note}` : ""}`}
                      >
                        <span className={c.cls} aria-label={`${label} on ${col.model}: ${c.label}`}>
                          {c.glyph}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Legend: <span className="text-verde">●</span> likely fits*,{" "}
        <span className="text-ambra">◐</span> adapts with work*,{" "}
        <span className="text-stone-400">○</span> no fit*. *Unverified
        pattern — nothing here is a confirmed fitment claim. Confirm against
        your frame number and parts book.
      </p>
    </div>
  );
}
