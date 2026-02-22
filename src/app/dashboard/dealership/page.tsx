import { requireRole } from "@/lib/auth-utils";
import { getMyDealership } from "@/lib/actions/dealership";
import DealershipForm from "@/components/dashboard/dealership-form";

export const metadata = { title: "Dealership Profile — Royal Cars" };

export default async function DealershipPage() {
  await requireRole(["DEALER", "ADMIN"]);
  const dealership = await getMyDealership();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">
        {dealership ? "Dealership Profile" : "Create Your Dealership"}
      </h1>
      <p className="text-neutral-500 mb-8">
        {dealership
          ? "Update your dealership information."
          : "Set up your dealership to start listing vehicles."}
      </p>

      <div className="max-w-2xl">
        <DealershipForm dealership={dealership} />
      </div>
    </div>
  );
}
