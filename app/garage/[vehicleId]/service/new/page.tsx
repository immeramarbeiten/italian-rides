import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceRecordForm } from "@/components/service-record-form";

export const metadata = {
  title: "New service record — Italian Rides",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function NewServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ vehicleId: string }>;
  searchParams: Promise<{ part?: string }>;
}) {
  const { vehicleId } = await params;
  const { part } = await searchParams;
  return (
    <div className="pt-10">
      <Link
        href={`/garage/${vehicleId}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 hover:text-rosso hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> PASSPORT
      </Link>
      <h1 className="font-grotesk mt-3 text-4xl font-black tracking-tight">
        New service record
      </h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600">
        Close the loop: what you did, what you fitted, who did it. It lands
        on the passport timeline the moment you save.
      </p>
      <ServiceRecordForm vehicleId={vehicleId} initialPart={part ?? ""} />
    </div>
  );
}
