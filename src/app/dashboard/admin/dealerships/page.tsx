import { requireRole } from "@/lib/auth-utils";
import { getAllDealerships } from "@/lib/actions/admin";
import DealershipsAdminTable from "@/components/dashboard/admin/dealerships-table";

export const metadata = { title: "Manage Dealerships" };

export default async function AdminDealershipsPage() {
  await requireRole(["ADMIN"]);
  const dealerships = await getAllDealerships();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">All Dealerships</h1>
      <p className="text-neutral-500 mb-8">
        {dealerships.length} dealership{dealerships.length !== 1 ? "s" : ""} registered.
      </p>
      <DealershipsAdminTable dealerships={dealerships} />
    </div>
  );
}
