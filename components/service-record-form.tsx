"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGarage } from "@/lib/store";
import { VESPA_PARTS } from "@/lib/vespa-inspect";
import { CATALOG_PARTS } from "@/lib/vespa-parts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full border border-line bg-white px-3 py-2 text-sm focus:border-rosso focus:outline-none";

const WORK_TYPES = ["Maintenance", "Repair", "Restoration", "Inspection"] as const;
const ATTRIBUTIONS = ["Owner", "Workshop", "Other"] as const;

export function ServiceRecordForm({
  vehicleId,
  initialPart,
}: {
  vehicleId: string;
  initialPart: string;
}) {
  const router = useRouter();
  const scooters = useGarage((s) => s.scooters);
  const addServiceEntry = useGarage((s) => s.addServiceEntry);
  const v = scooters.find((s) => s.id === vehicleId);

  const validPart = VESPA_PARTS.some((p) => p.id === initialPart)
    ? initialPart
    : "";
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [component, setComponent] = useState(validPart);
  const [workType, setWorkType] = useState<(typeof WORK_TYPES)[number]>("Maintenance");
  const [description, setDescription] = useState("");
  const [procedure, setProcedure] = useState("");
  const [partRef, setPartRef] = useState("");
  const [attribution, setAttribution] = useState<(typeof ATTRIBUTIONS)[number]>("Owner");
  const [mileage, setMileage] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!v) {
    return (
      <div className="border border-dashed border-line px-6 py-12 text-center">
        <p className="font-grotesk text-2xl font-bold">No such scooter here.</p>
        <Link href="/garage" className={cn(buttonVariants({}), "mt-5")}>
          Back to the garage
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!description.trim()) {
      setError("Describe the work — one line is enough.");
      return;
    }
    const compLabel =
      component === "general"
        ? "General"
        : (VESPA_PARTS.find((p) => p.id === component)?.label ?? "General");
    const procTitle = CATALOG_PARTS.find((c) => c.id === procedure)?.guide.title;
    const bits = [`${workType} · ${compLabel} — ${description.trim()}`];
    if (procTitle) bits.push(`[procedure: ${procTitle}]`);
    if (partRef.trim()) bits.push(`[part: ${partRef.trim()}]`);
    bits.push(`(by ${attribution.toLowerCase()})`);
    try {
      addServiceEntry({
        scooterId: vehicleId,
        date: date || new Date().toISOString().slice(0, 10),
        mileage: Math.max(0, Math.round(Number(mileage) || v?.mileage || 0)),
        entry: bits.join(" "),
      });
      router.push(`/garage/${vehicleId}`);
    } catch {
      setError("Could not save — your entries above are kept. Try again.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid max-w-2xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputCls} mt-1`}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Mileage at service (km)</span>
          <input
            type="number"
            min={0}
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder={String(v.mileage)}
            className={`${inputCls} mt-1`}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Component</span>
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className={`${inputCls} mt-1`}
          >
            <option value="">General / whole scooter</option>
            {VESPA_PARTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Type of work</span>
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value as typeof workType)}
            className={`${inputCls} mt-1`}
          >
            {WORK_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="font-medium">What was done</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. Replaced front brake shoes, cleaned the drum, adjusted the cable"
          className={`${inputCls} mt-1`}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Procedure followed (optional)</span>
          <select
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            className={`${inputCls} mt-1`}
          >
            <option value="">None</option>
            {CATALOG_PARTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.guide.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Part reference (optional)</span>
          <input
            value={partRef}
            onChange={(e) => setPartRef(e.target.value)}
            placeholder="e.g. Piaggio 58123R"
            className={`${inputCls} mt-1`}
          />
        </label>
      </div>
      <label className="block max-w-xs text-sm">
        <span className="font-medium">Completed by</span>
        <select
          value={attribution}
          onChange={(e) => setAttribution(e.target.value as typeof attribution)}
          className={`${inputCls} mt-1`}
        >
          {ATTRIBUTIONS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      {error && (
        <p role="alert" className="border border-rosso-deep bg-white px-4 py-3 text-sm text-rosso-deep">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={cn(buttonVariants({}))}>
          Save service record
        </button>
        <Link
          href={`/garage/${vehicleId}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
