import { cn } from "@/lib/utils";

/**
 * Stylized Vespa side elevation in the current text color.
 * Placeholder identity until Blender renders / licensed photos land —
 * frieze frames already accept an `art` map to replace it per model.
 */
export function VespaLineArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 140"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      >
        <circle cx="64" cy="102" r="24" />
        <circle cx="196" cy="102" r="24" />
        <path d="M41 99 C41 71 57 59 85 59" />
        <path d="M60 53 Q88 49 117 53" />
        <path d="M112 91 L149 91" />
        <path d="M149 91 C151 63 159 39 175 31" />
        <path d="M165 31 L197 31" />
        <path d="M179 31 L173 15" />
        <circle cx="171" cy="12" r="3.5" />
        <path d="M191 35 L198 76" />
        <path d="M173 79 C183 69 211 69 221 79" />
        <circle cx="170" cy="49" r="6" />
        <path d="M41 99 L37 79" />
        <path d="M102 107 L134 107" strokeWidth="5" />
      </g>
      <circle cx="64" cy="102" r="4.5" fill="currentColor" />
      <circle cx="196" cy="102" r="4.5" fill="currentColor" />
    </svg>
  );
}
