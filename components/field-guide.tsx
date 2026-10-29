"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FIELD_GUIDE_VARIANTS,
  GUIDE_SYSTEMS,
} from "@/lib/field-guide";
import { Callout, FigCaption } from "@/components/fig";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * "Inside the Vespa" — an interactive field guide, not fake 3D.
 * Original simplified line illustration; fuel system documented for two
 * GTS configurations, everything else honestly marked not-yet-documented.
 */

export function ScooterStage({
  fuel,
  showSystem = true,
}: {
  fuel: "carburettor" | "injection";
  showSystem?: boolean;
}) {
  const dim = "text-stone-300";
  const line = "text-ink";
  return (
    <svg
      viewBox="0 0 320 190"
      className="h-auto w-full"
      role="img"
      aria-label="Simplified Vespa side profile with fuel system highlighted"
    >
      {/* wheels */}
      <circle cx="62" cy="150" r="24" fill="none" stroke="currentColor" strokeWidth="3" className={line} />
      <circle cx="250" cy="150" r="24" fill="none" stroke="currentColor" strokeWidth="3" className={line} />
      {/* Vespa profile, facing left: fender, legshield, column, headset,
          step-through floor, rear cowl, tail. Schematic, not to scale. */}
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={line}>
        {/* front fender hugging the wheel */}
        <path d="M36 148 C37 126 48 116 62 116 C76 116 87 126 88 148" />
        {/* legshield sweeping up from the wheel */}
        <path d="M44 146 C42 108 54 82 80 70" />
        {/* steering column + headlamp + handlebar */}
        <path d="M80 70 L88 36" />
        <circle cx="88" cy="50" r="6" />
        <path d="M70 38 Q88 33 106 38" />
        {/* step-through floor + stand */}
        <path d="M96 142 L198 142" />
        <path d="M150 142 L150 160" />
        {/* rear body rising to meet the seat */}
        <path d="M198 142 C200 112 212 92 230 84" />
        {/* side cowl falling behind the rear wheel */}
        <path d="M270 80 C282 90 286 110 284 130 C283 138 282 142 280 146" />
        {/* tail tick */}
        <path d="M283 116 L290 116" />
      </g>
      {/* seat */}
      <path d="M205 84 Q236 76 270 83 L268 92 Q238 86 207 92 Z" fill="currentColor" className={dim} />
      {/* fuel path: tank → pump → carb/injector → engine */}
      {showSystem && (
      <g>
        <path
          d="M228 100 C226 108 225 112 225 118 C224 125 223 129 222 134 C222 140 222 145 222 150"
          fill="none"
          stroke="#C8102E"
          strokeWidth="2.5"
          strokeDasharray="5 4"
        />
        {[
          { cx: 228, cy: 100, n: "1" },
          { cx: 225, cy: 118, n: "2" },
          { cx: 222, cy: 134, n: "3" },
          { cx: 222, cy: 150, n: "4" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.cx} cy={p.cy} r="7" fill="#C8102E" />
            <text
              x={p.cx}
              y={p.cy + 3}
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill="#fff"
            >
              {p.n}
            </text>
          </g>
        ))}
        <text x="195" y="103" textAnchor="end" fontSize="9" fill="#57534E">
          tank
        </text>
        <text x="195" y="121" textAnchor="end" fontSize="9" fill="#57534E">
          pump
        </text>
        <text x="195" y="137" textAnchor="end" fontSize="9" fill="#57534E">
          {fuel === "carburettor" ? "carburettor" : "injector"}
        </text>
        <text x="195" y="153" textAnchor="end" fontSize="9" fill="#57534E">
          engine
        </text>
      </g>
      )}
    </svg>
  );
}

export function FieldGuide() {
  const [variantId, setVariantId] = useState("gts125");
  const [systemId, setSystemId] = useState("fuel");
  const variant =
    FIELD_GUIDE_VARIANTS.find((v) => v.id === variantId) ??
    FIELD_GUIDE_VARIANTS[0];
  const system = GUIDE_SYSTEMS.find((s) => s.id === systemId) ?? GUIDE_SYSTEMS[0];
  const documented = system.id === "fuel";

  return (
    <div className="border border-line bg-white">
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        <div className="border-b border-zinc-300 bg-zinc-100 p-6 lg:border-r lg:border-b-0">
          <ScooterStage fuel={variant.fuel.kind} />
          <FigCaption no={2} className="mt-3">
            Schematic profile — simplified shapes, not to scale or measure
            from
          </FigCaption>
        </div>
        <div className="p-6">
          <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
            SELECT CONFIGURATION
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Select documented configuration">
            {FIELD_GUIDE_VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                aria-pressed={variantId === v.id}
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: variantId === v.id ? "default" : "outline",
                  }),
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] text-zinc-500">
            {variant.chassisPrefix} · {variant.enginePrefix}
          </p>

          <p className="mt-5 font-mono text-[11px] tracking-[0.14em] text-zinc-500">
            SELECT SYSTEM
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Select system">
            {GUIDE_SYSTEMS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSystemId(s.id)}
                aria-pressed={systemId === s.id}
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: systemId === s.id ? "racing" : "outline",
                  }),
                )}
              >
                {s.label}
                {!s.documented && (
                  <span className="font-mono text-[10px] opacity-70">· soon</span>
                )}
              </button>
            ))}
          </div>

          {documented ? (
            <div className="mt-5">
              <p className="font-grotesk text-xl font-bold">
                {variant.fuel.kind === "carburettor"
                  ? "Fuel via carburettor"
                  : "Fuel via injection"}
              </p>
              <ol className="mt-3 space-y-2">
                {variant.fuel.flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-2 text-sm">
                    <Callout n={i + 1} active={i === 2} label={`Flow step ${i + 1}: ${step}`} />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Understand.</strong> {variant.fuel.understand}
                </p>
                <p>
                  <strong>Explore.</strong> {variant.fuel.explore}
                </p>
              </div>
              <details className="mt-4 border border-zinc-300 bg-white text-sm">
                <summary className="cursor-pointer px-3 py-2 font-medium">
                  Why this answer?
                </summary>
                <div className="border-t border-line px-3 py-2 font-mono text-[11px] leading-relaxed text-zinc-600">
                  <p>MANUAL — {variant.source.manual.toUpperCase()}</p>
                  <p>PAGES — {variant.source.pages.toUpperCase()}</p>
                  <p>SCOPE — {variant.source.scope.toUpperCase()}</p>
                  <p>EVIDENCE — MANUAL-SOURCED, REVIEWED AGAINST PDF</p>
                </div>
              </details>
              <nav aria-label="Knowledge trail" className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-zinc-600">
                <span className="border border-line px-2 py-1">{variant.name}</span>
                <span aria-hidden>→</span>
                <span className="border border-line px-2 py-1">fuel system</span>
                <span aria-hidden>→</span>
                <span className="border border-rosso bg-rosso px-2 py-1 text-white">
                  {variant.fuel.kind}
                </span>
                <span aria-hidden>→</span>
                <Link href="/methodology#sources" className="border border-line px-2 py-1 underline underline-offset-2 hover:text-rosso">
                  manual
                </Link>
              </nav>
            </div>
          ) : (
            <div className="mt-5 border border-dashed border-line p-4">
              <p className="font-grotesk font-bold">
                {system.label} — not yet documented.
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Only the fuel system has manual-sourced diagrams so far. Other
                systems appear here as their evidence lands — never as
                guesses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
