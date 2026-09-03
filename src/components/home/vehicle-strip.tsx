import Link from "next/link";
import type { ListVehicle } from "@/lib/data/vehicles";
import CarCard from "@/components/cars/car-card";

/**
 * A horizontal row of real listings.
 *
 * The landing page previously showed no inventory at all: a visitor never saw
 * a single car before clicking through to /cars.
 */
export default function VehicleStrip({
  title,
  vehicles,
  href,
  linkLabel = "See all",
  savedIds,
  isLoggedIn,
  priority = false,
}: {
  title: string;
  vehicles: ListVehicle[];
  href: string;
  linkLabel?: string;
  savedIds: string[];
  isLoggedIn: boolean;
  priority?: boolean;
}) {
  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        <Link
          href={href}
          className="-my-1.5 shrink-0 py-1.5 text-body-sm font-semibold text-brand-strong hover:underline"
        >
          {linkLabel}
        </Link>
      </div>

      {/* Scrolls on a phone, grid on wider screens — no carousel controls to
          hunt for, and it works with a thumb. */}
      <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {vehicles.slice(0, 4).map((vehicle, i) => (
          <li
            key={vehicle.id}
            className="w-[78vw] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none"
          >
            <CarCard
              vehicle={vehicle}
              isSaved={savedIds.includes(vehicle.id)}
              isLoggedIn={isLoggedIn}
              priority={priority && i < 2}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
