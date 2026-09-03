import { revalidateTag } from "next/cache";

/**
 * Cache tags for the marketplace read layer (see `src/lib/data`).
 *
 * Listing pages, facet counts and the brand list are cached indefinitely and
 * invalidated by tag whenever a vehicle changes, rather than being re-queried
 * on every render.
 */
export const CACHE_TAGS = {
  /** Any query whose result depends on the set of vehicles. */
  vehicles: "vehicles",
  /** Distinct brands, body types, price bounds and other facet aggregates. */
  facets: "vehicle-facets",
  /** A single vehicle detail record. */
  vehicle: (id: string) => `vehicle:${id}`,
  /** Dealership profile and its listing count. */
  dealerships: "dealerships",
} as const;

/**
 * Invalidate everything that depends on vehicle rows. Call from every vehicle
 * mutation. Pass the vehicle id to also drop that detail page's cache entry.
 */
export async function revalidateVehicleData(vehicleId?: string) {
  const tags: string[] = [
    CACHE_TAGS.vehicles,
    CACHE_TAGS.facets,
    CACHE_TAGS.dealerships,
  ];
  if (vehicleId) tags.push(CACHE_TAGS.vehicle(vehicleId));

  for (const tag of tags) {
    // Next 16 requires a cache-life profile. "max" matches how these entries
    // are declared: cached until a mutation invalidates them, never by age.
    revalidateTag(tag, "max");
  }
}
