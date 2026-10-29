import Link from "next/link";

export const metadata = { title: "Events & Rides — Italian Rides" };

export default function EventsPage() {
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        COMMUNITY — PREVIEW
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight sm:text-5xl">
        Events & rides
      </h1>
      <div className="mt-6 max-w-2xl border border-dashed border-line bg-white p-6">
        <p className="font-grotesk text-lg font-bold">No rides posted yet.</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          The calendar opens with real club events — organiser, date, meeting
          point, vehicle scope and an official registration link. Until then,
          find your people in the{" "}
          <Link href="/clubs" className="font-medium text-rosso underline underline-offset-2">
            club directory
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
