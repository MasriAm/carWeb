import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-utils";
import { getVehicleById } from "@/lib/actions/vehicles";
import { auth } from "@/lib/auth";
import VehicleForm from "@/components/dashboard/vehicle-form";

export const metadata = { title: "Edit Vehicle" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: Props) {
  await requireRole(["DEALER", "ADMIN"]);
  const session = await auth();
  const { id } = await params;

  const vehicle = await getVehicleById(id);
  if (!vehicle) redirect("/dashboard/vehicles");

  if (vehicle.userId !== session?.user?.id && session?.user?.role !== "ADMIN") {
    redirect("/dashboard/vehicles");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Edit Vehicle</h1>
      <VehicleForm
        vehicle={vehicle as Parameters<typeof VehicleForm>[0]["vehicle"]}
        redirectTo="/dashboard/vehicles"
      />
    </div>
  );
}
