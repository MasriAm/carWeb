import { requireRole } from "@/lib/auth-utils";
import { getVehicleById } from "@/lib/actions/vehicles";
import VehicleForm from "@/components/dashboard/vehicle-form";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Vehicle" };

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditVehiclePage({ params }: EditVehiclePageProps) {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">
        Edit: {vehicle.brand} {vehicle.model}
      </h1>
      <p className="text-zinc-400 mb-8">Update this vehicle listing.</p>
      <div className="max-w-3xl">
        <VehicleForm vehicle={vehicle} />
      </div>
    </div>
  );
}
