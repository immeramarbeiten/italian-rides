import Link from "next/link";

export const metadata = {
  title: "Service job — Italian Rides",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="pt-10">
      <p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
        WORKSHOP — JOB {id.slice(0, 8).toUpperCase()}
      </p>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight">
        Service job
      </h1>
      <div className="mt-6 max-w-2xl border border-dashed border-line bg-white p-6">
        <p className="font-grotesk text-lg font-bold">
          Identify → reference → document → report.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          The first testable workshop workflow: identify the component, find
          the reference, document the service, send the owner their report.
          Full job cards with customer vehicles land after launch — the queue
          lives on the{" "}
          <Link href="/workshop" className="font-medium text-rosso underline underline-offset-2">
            workshop desk
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
