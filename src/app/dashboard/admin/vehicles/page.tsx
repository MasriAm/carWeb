import { requireRole } from "@/lib/auth-utils";
import { getAllVehiclesAdmin } from "@/lib/actions/admin";
import AdminVehicleTable from "@/components/dashboard/admin/vehicles-table";

export const metadata = { title: "Manage Vehicles" };

export default async function AdminVehiclesPage() {
  await requireRole(["ADMIN"]);
  const vehicles = await getAllVehiclesAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">All Vehicles</h1>
      <p className="text-neutral-500 mb-8">
        {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} platform-wide.
      </p>
      <AdminVehicleTable vehicles={vehicles} />
    </div>
  );
}
