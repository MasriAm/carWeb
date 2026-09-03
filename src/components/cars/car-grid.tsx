import type { ListVehicle } from "@/lib/data/vehicles";
import CarCard from "./car-card";

/**
 * Results grid.
 *
 * A server component with no entrance animation. The previous version wrapped
 * every card in a Framer `initial={{ opacity: 0 }}`, which meant the server
 * shipped all twelve cards as `style="opacity:0"` and the listing stayed
 * blank until React hydrated. On a mid-range phone the first card was in the
 * DOM at 0.9s and visible at 3.3s. Nothing readable animates in from
 * invisible.
 */
export default function CarGrid({
  vehicles,
  savedIds,
  isLoggedIn,
  featuredIds,
}: {
  vehicles: ListVehicle[];
  savedIds: string[];
  isLoggedIn: boolean;
  featuredIds?: string[];
}) {
  const featured = new Set(featuredIds ?? []);

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle, i) => (
        <li key={vehicle.id}>
          <CarCard
            vehicle={vehicle}
            isSaved={savedIds.includes(vehicle.id)}
            isLoggedIn={isLoggedIn}
            isFeatured={featured.has(vehicle.id)}
            /* Only the first row competes for LCP. */
            priority={i < 3}
          />
        </li>
      ))}
    </ul>
  );
}
