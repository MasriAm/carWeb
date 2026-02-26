import Link from "next/link";
import { requireRole } from "@/lib/auth-utils";
import { getAllVehiclesAdmin } from "@/lib/actions/admin";
import AdminVehicleTable from "@/components/dashboard/admin/vehicles-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "Manage Vehicles" };

export default async function AdminVehiclesPage() {
  await requireRole(["ADMIN"]);
  const vehicles = await getAllVehiclesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">All Vehicles</h1>
          <p className="text-zinc-400">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} platform-wide.
          </p>
        </div>
        <Link href="/dashboard/admin/vehicles/new">
          <Button className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>
      <AdminVehicleTable vehicles={vehicles} />
    </div>
  );
}
