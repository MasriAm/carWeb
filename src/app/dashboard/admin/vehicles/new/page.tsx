import { requireRole } from "@/lib/auth-utils";
import VehicleForm from "@/components/dashboard/vehicle-form";

export const metadata = { title: "Add Vehicle" };

export default async function AdminNewVehiclePage() {
  await requireRole(["ADMIN"]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Add New Vehicle</h1>
      <p className="text-zinc-400 mb-8">Create a new vehicle listing on the platform.</p>
      <div className="max-w-3xl">
        <VehicleForm vehicle={null} />
      </div>
    </div>
  );
}
