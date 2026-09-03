import Link from "next/link";
import { requireRole } from "@/lib/auth-utils";
import { getMyVehicles } from "@/lib/actions/dealership";
import VehicleTable from "@/components/dashboard/vehicle-table";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";

export const metadata = { title: "My Vehicles" };

export default async function MyVehiclesPage() {
  await requireRole(["DEALER", "ADMIN"]);
  const vehicles = await getMyVehicles();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h1 text-ink mb-1">My Vehicles</h1>
          <p className="text-ink-3">
            {vehicles.length} listing{vehicles.length !== 1 ? "s" : ""} total.
          </p>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Car className="h-16 w-16 text-ink-3 mb-4" />
          <h2 className="text-xl font-semibold text-ink-2 mb-2">
            No vehicles listed yet
          </h2>
          <p className="text-ink-3 mb-6">
            Your vehicle listings will appear here.
          </p>
          <Link href="/dashboard/vehicles/new">
            <Button className="bg-brand text-brand-ink hover:bg-brand-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </Link>
        </div>
      ) : (
        <VehicleTable vehicles={vehicles} />
      )}
    </div>
  );
}
