import Link from "next/link";
import { Heart } from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { getSavedVehicles } from "@/lib/data/session";
import { Button } from "@/components/ui/button";
import CarGrid from "@/components/cars/car-grid";

export const metadata = { title: "Saved cars" };

export default async function SavedPage() {
  await requireAuth();
  const saved = await getSavedVehicles();
  const vehicles = saved.map((s) => s.vehicle);
  const savedIds = saved.map((s) => s.vehicleId);

  return (
    <div>
      <h1 className="text-h2 font-bold text-ink">Saved cars</h1>
      <p className="mt-1 text-body-sm text-ink-3">
        {vehicles.length} {vehicles.length === 1 ? "car" : "cars"} in your list.
      </p>

      <div className="mt-8">
        {vehicles.length === 0 ? (
          <div className="rounded-card border border-line bg-surface px-6 py-16 text-center">
            <Heart className="mx-auto mb-4 h-10 w-10 text-ink-3" aria-hidden="true" />
            <h2 className="text-title font-semibold text-ink">
              Nothing saved yet
            </h2>
            <p className="mx-auto mt-2 max-w-prose text-body-sm text-ink-3">
              Tap the heart on any listing to keep it here for later.
            </p>
            <Button asChild className="mt-6">
              <Link href="/cars">Browse cars</Link>
            </Button>
          </div>
        ) : (
          <CarGrid vehicles={vehicles} savedIds={savedIds} isLoggedIn />
        )}
      </div>
    </div>
  );
}
