import { requireRole } from "@/lib/auth-utils";
import { getMyVehicles } from "@/lib/actions/dealership";
import VehicleTable from "@/components/dashboard/vehicle-table";
import { Car } from "lucide-react";

export const metadata = { title: "My Vehicles" };

export default async function MyVehiclesPage() {
  await requireRole(["DEALER", "ADMIN"]);
  const vehicles = await getMyVehicles();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Vehicles</h1>
          <p className="text-neutral-500">
            {vehicles.length} listing{vehicles.length !== 1 ? "s" : ""} total.
          </p>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Car className="h-16 w-16 text-neutral-300 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            No vehicles listed yet
          </h2>
          <p className="text-neutral-500">
            Your vehicle listings will appear here.
          </p>
        </div>
      ) : (
        <VehicleTable vehicles={vehicles} />
      )}
    </div>
  );
}
