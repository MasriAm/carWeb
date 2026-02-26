import { requireRole } from "@/lib/auth-utils";
import DealerVehicleForm from "@/components/dashboard/dealer-vehicle-form";

export const metadata = { title: "Add Vehicle" };

export default async function DealerNewVehiclePage() {
  await requireRole(["DEALER", "ADMIN"]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">List a New Vehicle</h1>
      <p className="text-zinc-400 mb-8">Fill in the details below to create a new listing.</p>
      <DealerVehicleForm />
    </div>
  );
}
