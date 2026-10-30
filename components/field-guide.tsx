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
      {/* wheels with hubs */}
      <circle cx="62" cy="150" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={line} />
      <circle cx="250" cy="150" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" className={line} />
      <circle cx="62" cy="150" r="5" fill="none" stroke="currentColor" strokeWidth="2" className={line} />
      <circle cx="250" cy="150" r="5" fill="none" stroke="currentColor" strokeWidth="2" className={line} />
      {/* Vespa profile, facing left. Schematic, not to scale. */}
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={line}>
        {/* front fork + fender */}
        <path d="M64 148 L78 118" />
        <path d="M32 150 C32 122 45 110 62 110 C79 110 92 122 92 150" />
        {/* legshield: outer sweep + inner edge */}
        <path d="M36 140 C35 110 50 80 78 60 C86 54 92 52 97 52" />
        <path d="M48 134 C46 110 58 84 82 68" />
        {/* steering column + headlamp + handlebar + mirror */}
        <path d="M97 54 L101 32" />
        <circle cx="101" cy="45" r="7" />
        <path d="M83 33 Q101 28 119 33" />
        <path d="M113 32 L123 19" />
        <ellipse cx="127" cy="16" rx="7" ry="4.5" />
        {/* step-through floor + rails + stand */}
        <path d="M100 142 L198 142" />
        <path d="M100 147 L198 147" />
        <path d="M150 142 L150 162" />
        <path d="M150 162 L157 162" />
        {/* rear body + side cowl */}
        <path d="M198 142 C200 118 208 100 220 90" />
        <path d="M268 84 C280 92 286 108 285 124 C284 136 282 142 280 146" />
        <path d="M282 146 C260 149 230 149 205 145" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className={line}>
        {/* horn vent + indicator */}
        <path d="M69 102 L78 100" />
        <path d="M68 108 L77 106" />
        <path d="M67 114 L76 112" />
        <ellipse cx="90" cy="94" rx="3" ry="5" />
        {/* cowl vents + tail lamp */}
        <path d="M240 106 L250 106" />
        <path d="M239 112 L249 112" />
        <path d="M238 118 L248 118" />
        <rect x="281" y="96" width="5" height="12" rx="2" />
      </g>
      {/* seat with stitch line */}
      <path d="M205 84 C225 78 250 76 270 81 L268 90 C248 86 226 87 207 92 Z" fill="currentColor" className={dim} />
      <path d="M210 86 C230 82 250 81 264 84" fill="none" stroke="currentColor" strokeWidth="1" className={line} />
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
