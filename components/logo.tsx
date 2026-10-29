import { cn } from "@/lib/utils";

/**
 * Italian Rides mark — an abstract wasp (vespa, literally) in top view:
 * two wings, body, head, antennae. Inherits the current text color.
 *
 * `detail={false}` drops the antennae for use below 24px (see brand guide).
 */
export function LogoMark({
  className,
  detail = true,
}: {
  className?: string;
  detail?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <g fill="currentColor" opacity="0.85">
        <path d="M15 13.5 C10.5 6.5 5 7.5 5 13 C5 18.5 10.5 20.5 14.5 16.5 Z" />
        <path d="M17 13.5 C21.5 6.5 27 7.5 27 13 C27 18.5 21.5 20.5 17.5 16.5 Z" />
      </g>
      <g fill="currentColor">
        <ellipse cx="16" cy="18.5" rx="3.4" ry="7.5" />
        <circle cx="16" cy="8.5" r="2.6" />
      </g>
      {detail && (
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M14.6 6.4 L12.2 3.4" />
          <path d="M17.4 6.4 L19.8 3.4" />
        </g>
      )}
    </svg>
  );
}
