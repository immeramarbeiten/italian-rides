"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VESPA_MODELS } from "@/lib/vespa-data";
import { useGarage } from "@/lib/store";

const inputCls =
  "w-full border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-lagoon focus:outline-none";

export function GarageManager() {
  const {
    saved,
    toggle,
    scooters,
    addScooter,
    removeScooter,
    setMileage,
    serviceLog,
    addServiceEntry,
    removeServiceEntry,
    loadDemo,
  } = useGarage();

  const [model, setModel] = useState(VESPA_MODELS[7].m);
  const [year, setYear] = useState("");
  const [mileage, setMileageInput] = useState("");
  const [notes, setNotes] = useState("");

  const [logScooter, setLogScooter] = useState("");
  const [logDate, setLogDate] = useState("");
  const [logMileage, setLogMileage] = useState("");
  const [logEntry, setLogEntry] = useState("");

  const [odoDrafts, setOdoDrafts] = useState<Record<string, string>>({});

  const savedModels = VESPA_MODELS.filter((m) => saved.includes(m.m));
  const scooterName = (id: string) =>
    scooters.find((s) => s.id === id)?.model ?? "Sold scooter";

  function submitScooter(e: React.FormEvent) {
    e.preventDefault();
    const miles = Math.max(0, Math.round(Number(mileage) || 0));
    addScooter({
      model,
      year: year.trim() || "—",
      mileage: miles,
      notes: notes.trim(),
    });
    setYear("");
    setMileageInput("");
    setNotes("");
  }

  function submitLog(e: React.FormEvent) {
    e.preventDefault();
    if (!logScooter || !logEntry.trim()) return;
    addServiceEntry({
      scooterId: logScooter,
      date: logDate || new Date().toISOString().slice(0, 10),
      mileage: Math.max(0, Math.round(Number(logMileage) || 0)),
      entry: logEntry.trim(),
    });
    setLogEntry("");
    setLogMileage("");
  }

  return (
    <div>
      <section aria-labelledby="my-scooters">
        <h2 id="my-scooters" className="font-display mt-8 text-xl">
          My scooters ({scooters.length})
        </h2>
        {scooters.length === 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-zinc-500">
              No scooters parked yet — add your first one below, or start
              from a sample. Everything stays in this browser.
            </p>
            <Button type="button" size="sm" variant="outline" onClick={loadDemo}>
              Load sample scooter
            </Button>
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {scooters.map((s) => (
              <Card key={s.id} className="border-lagoon">
                <CardHeader>
                  <CardTitle>
                    {s.model} <span className="text-lagoon">· {s.year}</span>
                  </CardTitle>
                  <p className="text-sm text-zinc-600 tabular-nums">
                    {s.mileage.toLocaleString()} km on the clock
                  </p>
                  {s.notes && (
                    <p className="text-sm text-zinc-600">{s.notes}</p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="New mileage"
                    aria-label={`Update mileage for ${s.model}`}
                    value={odoDrafts[s.id] ?? ""}
                    onChange={(e) =>
                      setOdoDrafts((d) => ({ ...d, [s.id]: e.target.value }))
                    }
                    className="w-32 border border-stone-300 bg-white px-2 py-1.5 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const v = Math.max(
                        0,
                        Math.round(Number(odoDrafts[s.id]) || s.mileage),
                      );
                      setMileage(s.id, v);
                      setOdoDrafts((d) => ({ ...d, [s.id]: "" }));
                    }}
                  >
                    Log miles
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeScooter(s.id)}
                    aria-label={`Remove ${s.model}`}
                  >
                    <Trash2 className="size-4" /> Remove
                  </Button>
                  <Link
                    href={`/garage/${s.id}`}
                    className="inline-flex h-8 items-center rounded-full border border-line bg-white px-3 text-xs font-medium transition-colors hover:border-ink"
                  >
                    Open passport →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <form
          onSubmit={submitScooter}
          className="mt-4 grid gap-3 border border-stone-300 bg-white p-5 sm:grid-cols-2"
        >
          <label className="block text-sm">
            <span className="font-medium">Model</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`${inputCls} mt-1`}
            >
              {VESPA_MODELS.map((m) => (
                <option key={m.m} value={m.m}>
                  {m.m} ({m.y})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Build year</span>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 1979"
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Current mileage (km)</span>
            <input
              type="number"
              min={0}
              value={mileage}
              onChange={(e) => setMileageInput(e.target.value)}
              placeholder="e.g. 24500"
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Notes</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Original paint, Pinasco kit"
              className={`${inputCls} mt-1`}
            />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              <Plus className="size-4" /> Park a scooter
            </Button>
          </div>
        </form>
      </section>

      <section aria-labelledby="service-log">
        <h2 id="service-log" className="font-display mt-10 text-xl">
          Service log ({serviceLog.length})
        </h2>
        {scooters.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            Park a scooter first — service entries attach to a scooter.
          </p>
        ) : (
          <form
            onSubmit={submitLog}
            className="mt-3 grid gap-3 border border-stone-300 bg-white p-5 sm:grid-cols-2"
          >
            <label className="block text-sm">
              <span className="font-medium">Scooter</span>
              <select
                value={logScooter}
                onChange={(e) => setLogScooter(e.target.value)}
                className={`${inputCls} mt-1`}
                required
              >
                <option value="">Choose…</option>
                {scooters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.model} ({s.year})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium">Date</span>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className={`${inputCls} mt-1`}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Mileage at service (km)</span>
              <input
                type="number"
                min={0}
                value={logMileage}
                onChange={(e) => setLogMileage(e.target.value)}
                placeholder="e.g. 24610"
                className={`${inputCls} mt-1`}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Work done</span>
              <input
                value={logEntry}
                onChange={(e) => setLogEntry(e.target.value)}
                placeholder="e.g. New belt + rollers, gearbox oil"
                className={`${inputCls} mt-1`}
                required
              />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" size="sm">
                <Plus className="size-4" /> Log service
              </Button>
            </div>
          </form>
        )}

        {serviceLog.length > 0 && (
          <ol className="mt-4 space-y-2">
            {serviceLog.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border border-stone-300 bg-parchment px-4 py-2.5 text-sm"
              >
                <span className="font-medium">{scooterName(e.scooterId)}</span>
                <span className="text-zinc-500 tabular-nums">
                  {e.date} · {e.mileage.toLocaleString()} km
                </span>
                <span className="w-full sm:w-auto sm:flex-1">{e.entry}</span>
                <button
                  type="button"
                  onClick={() => removeServiceEntry(e.id)}
                  className="ml-auto text-xs text-zinc-500 underline hover:text-racing"
                >
                  Delete
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="shortlist">
        <h2 id="shortlist" className="font-display mt-10 text-xl">
          Shortlist ({savedModels.length})
        </h2>
        {savedModels.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            Empty floor — bookmark models on the{" "}
            <Link href="/timeline" className="underline">
              timeline
            </Link>{" "}
            or tap below to park them here.
          </p>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedModels.map((m) => (
              <Card key={m.m} className="border-lagoon">
                <CardHeader>
                  <CardTitle>
                    {m.m} <span className="text-lagoon">· {m.y}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggle(m.m)}
                  >
                    <BookmarkCheck /> Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <h3 className="font-display mt-8 text-lg">All models</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VESPA_MODELS.map((m) => {
            const parked = saved.includes(m.m);
            return (
              <Card key={m.m}>
                <CardHeader>
                  <CardTitle>
                    {m.m} <span className="text-zinc-500">· {m.y}</span>
                  </CardTitle>
                  <p className="text-xs text-zinc-500">{m.engine}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant={parked ? "secondary" : "default"}
                    onClick={() => toggle(m.m)}
                  >
                    <Bookmark /> {parked ? "Parked" : "Park it"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
