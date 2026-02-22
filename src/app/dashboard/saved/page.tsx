import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import CarCard from "@/components/cars/car-card";
import { Heart } from "lucide-react";

export const metadata = { title: "Saved Cars — Royal Cars" };

export default async function SavedPage() {
  const user = await requireAuth();

  const saved = await db.savedVehicle.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: {
        include: {
          dealership: { select: { name: true, slug: true } },
          user: { select: { name: true } },
        },
      },
    },
  });

  const savedIds = saved.map((s) => s.vehicleId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Saved Cars</h1>
      <p className="text-neutral-500 mb-8">
        {saved.length} vehicle{saved.length !== 1 ? "s" : ""} in your wishlist.
      </p>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-16 w-16 text-neutral-300 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">No saved cars yet</h2>
          <p className="text-neutral-500 max-w-md">
            Browse our collection and tap the heart icon to save vehicles you like.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {saved.map((s) => (
            <CarCard
              key={s.id}
              vehicle={s.vehicle}
              isSaved={savedIds.includes(s.vehicleId)}
              isLoggedIn
            />
          ))}
        </div>
      )}
    </div>
  );
}
