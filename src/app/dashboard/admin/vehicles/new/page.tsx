import { requireRole } from "@/lib/auth-utils";
import VehicleForm from "@/components/dashboard/vehicle-form";

export const metadata = { title: "Add Vehicle" };

export default async function AdminNewVehiclePage() {
  await requireRole(["ADMIN"]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-1">Add New Vehicle</h1>
      <p className="text-ink-3 mb-8">Create a new vehicle listing on the platform.</p>
      <div className="max-w-3xl">
        <VehicleForm vehicle={null} />
      </div>
    </div>
  );
}
