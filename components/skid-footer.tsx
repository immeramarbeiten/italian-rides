import { LogoMark } from "@/components/logo";

export function SkidFooter() {
  return (
    <footer className="bg-asphalt text-fog">
      <div className="px-4 pt-8 sm:px-6">
        <svg
          viewBox="0 0 1200 90"
          preserveAspectRatio="none"
          className="block h-8 w-full"
          aria-hidden="true"
        >
          <path
            d="M-20 60 C 250 44, 420 76, 650 52 S 1000 22, 1220 46"
            fill="none"
            stroke="#0e0d0a"
            strokeWidth="8"
            opacity=".35"
          />
          <path
            d="M-20 73 C 250 57, 420 89, 650 65 S 1000 35, 1220 59"
            fill="none"
            stroke="#0e0d0a"
            strokeWidth="8"
            opacity=".35"
          />
        </svg>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-10 text-sm sm:px-6">
        <p className="flex items-center gap-3 font-display text-lg text-white">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-rosso text-white">
            <LogoMark className="h-6 w-6" />
          </span>
          Italian Rides
        </p>
        <p className="mt-3 max-w-3xl">
          The living archive for Italian two-wheel culture — model histories,
          systems, parts and clubs, with sources attached.
        </p>
        <p className="mt-2 max-w-3xl">
          Model facts paraphrased from public sources. Photographs remain
          © their authors — see credits. Not affiliated with Piaggio.
        </p>
        <nav aria-label="Footer" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.08em]">
          <a href="/archive" className="underline-offset-2 hover:text-white hover:underline">ARCHIVE</a>
          <a href="/inspect" className="underline-offset-2 hover:text-white hover:underline">INSPECT</a>
          <a href="/garage" className="underline-offset-2 hover:text-white hover:underline">GARAGE</a>
          <a href="/diagnose" className="underline-offset-2 hover:text-white hover:underline">DIAGNOSE</a>
          <a href="/glossary" className="underline-offset-2 hover:text-white hover:underline">GLOSSARY</a>
          <a href="/methodology" className="underline-offset-2 hover:text-white hover:underline">METHODOLOGY</a>
        </nav>
        <p className="mt-4 font-mono text-[11px] text-zinc-500">
          FAN-MADE TRIBUTE FOR THE META HACKATHON, OCT 2026
        </p>
      </div>
    </footer>
  );
}
