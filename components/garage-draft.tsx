"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUBCOMPONENTS } from "@/lib/guided-inspect";
import { getSession } from "@/lib/inspect-session";
import { useGarage } from "@/lib/store";
import { inspectionLabel } from "@/lib/inspection-label";

const OUTCOMES = ["Inspected", "Planned", "Referred", "Completed"] as const;

function DraftInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "";
  const [session] = useState(() => (from ? getSession(from) : null));
  const { scooters, addScooter, addServiceEntry } = useGarage();
  const [scooterId, setScooterId] = useState("");
  const [adding, setAdding] = useState(false);
  const [newModel, setNewModel] = useState("");
  const [newYear, setNewYear] = useState("");
  const [outcome, setOutcome] = useState<(typeof OUTCOMES)[number]>("Inspected");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [mileage, setMileage] = useState("");
  const [note, setNote] = useState("");

  if (!from || !session) return null;
  const partLabel = inspectionLabel(session);
  // Guided sub-detail only refines the assembly path; pilot labels are specific already.
  const subLabel =
    !session.pilotSelection && session.subPart && SUBCOMPONENTS[session.subPart]
      ? ` — ${SUBCOMPONENTS[session.subPart].label}`
      : "";
  const fullLabel = `${partLabel}${subLabel}`;

  function close() {
    router.replace("/garage");
  }

  function save() {
    if (!session) return;
    let target = scooterId;
    if (adding) {
      if (!newModel.trim()) return;
      const before = new Set(useGarage.getState().scooters.map((s) => s.id));
      addScooter({
        model: newModel.trim(),
        year: newYear.trim() || "—",
        mileage: Math.max(0, Math.round(Number(mileage) || 0)),
        notes: "",
      });
      target =
        useGarage.getState().scooters.find((s) => !before.has(s.id))?.id ?? "";
      if (!target) return;
    }
    if (!target) return;
    const bits = [
      `[${outcome}] ${fullLabel}`,
      note.trim() || session.fileName,
      `(inspection ${session.id}, recorded by user)`,
    ];
    if (session.concern) bits.splice(1, 0, `user said: “${session.concern}”`);
    addServiceEntry({
      scooterId: target,
      date: date || new Date().toISOString().slice(0, 10),
      mileage: Math.max(0, Math.round(Number(mileage) || 0)),
      entry: bits.join(" — "),
    });
    close();
  }

  return (
    <div className="mt-6 border border-ink bg-white p-5">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-600">
        DRAFT FROM INSPECTION — NOTHING SAVED YET
      </p>
      <div className="mt-3 flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.imageDataUrl}
          alt=""
          className="h-20 w-20 shrink-0 border border-line object-cover"
        />
        <div className="min-w-0 text-sm">
          <p className="font-medium">{fullLabel}</p>
          <p className="mt-1 text-xs text-zinc-600">
            {session.family || "Unknown model"}
            {session.engine ? ` ${session.engine}` : ""} · {session.fileName}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{session.matchNote}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Scooter</span>
          {!adding ? (
            <select
              value={scooterId}
              onChange={(e) => {
                if (e.target.value === "__new") {
                  setAdding(true);
                  setScooterId("");
                } else setScooterId(e.target.value);
              }}
              className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
            >
              <option value="">Choose…</option>
              {scooters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.model} ({s.year})
                </option>
              ))}
              <option value="__new">＋ Park a new scooter</option>
            </select>
          ) : (
            <span className="mt-1 flex gap-2">
              <input
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                placeholder="Model, e.g. GTS 300"
                className="w-full border border-line bg-white px-3 py-2 text-sm"
              />
              <input
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="Year"
                inputMode="numeric"
                className="w-24 border border-line bg-white px-3 py-2 text-sm"
              />
            </span>
          )}
        </label>
        <label className="block text-sm">
          <span className="font-medium">Outcome</span>
          <select
            value={outcome}
            onChange={(e) =>
              setOutcome(e.target.value as (typeof OUTCOMES)[number])
            }
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          >
            {OUTCOMES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Mileage (optional)</span>
          <input
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="e.g. 12400"
            inputMode="numeric"
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="mt-3 block text-sm">
        <span className="font-medium">Note</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you actually do or decide?"
          rows={2}
          className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
        />
      </label>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!adding && !scooterId}
          className="border border-ink bg-ink px-4 py-2 font-mono text-xs text-white disabled:opacity-40"
        >
          Save record
        </button>
        <button
          type="button"
          onClick={close}
          className="border border-line px-4 py-2 font-mono text-xs"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export function GarageDraft() {
  return (
    <Suspense fallback={null}>
      <DraftInner />
    </Suspense>
  );
}
