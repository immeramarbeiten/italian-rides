import { VehiclePassport } from "@/components/vehicle-passport";

export const metadata = {
  title: "Vehicle passport — Italian Rides",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  return (
    <div className="pt-10">
      <VehiclePassport vehicleId={vehicleId} />
    </div>
  );
}
