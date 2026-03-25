import { Suspense } from "react";
import {
  getVehicles,
  getDistinctBrands,
  getSavedVehicleIds,
} from "@/lib/actions/vehicles";
import { auth } from "@/lib/auth";
import InlineSidebarFilter from "@/components/cars/inline-sidebar-filter";
import CarsMarketplaceSort from "@/components/cars/cars-marketplace-sort";
import CarGrid from "@/components/cars/car-grid";
import Pagination from "@/components/cars/pagination";
import type { VehicleFilterInput } from "@/lib/validations/vehicle";
import { Car } from "lucide-react";

export const metadata = {
  title: "Browse Cars",
  description:
    "Search and filter luxury vehicles available in Jordan. Mercedes, BMW, Porsche, Toyota, and more from trusted dealers.",
};

interface CarsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function filtersFromParams(
  raw: Record<string, string | string[] | undefined>
): Partial<VehicleFilterInput> {
  const str = (k: string) => {
    const v = raw[k];
    return typeof v === "string" ? v : undefined;
  };
  const num = (k: string) => {
    const v = str(k);
    return v ? Number(v) : undefined;
  };

  return {
    brand: str("brand"),
    model: str("model"),
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    condition: str("condition") as VehicleFilterInput["condition"],
    bodyType: str("bodyType") as VehicleFilterInput["bodyType"],
    transmission: str("transmission") as VehicleFilterInput["transmission"],
    fuelType: str("fuelType") as VehicleFilterInput["fuelType"],
    year: num("year"),
    minYear: num("minYear"),
    maxYear: num("maxYear"),
    sortBy: str("sortBy") as VehicleFilterInput["sortBy"] | undefined,
    page: num("page") ?? 1,
    limit: 12,
  };
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const rawParams = await searchParams;
  const filters = filtersFromParams(rawParams);

  const [{ vehicles, total, page, totalPages }, brands, session, savedIds] =
    await Promise.all([
      getVehicles(filters),
      getDistinctBrands(),
      auth(),
      getSavedVehicleIds(),
    ]);

  const isLoggedIn = !!session?.user;

  return (
    <section className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-28 lg:pt-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <Suspense
            fallback={
              <div className="h-48 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50 lg:col-span-1" />
            }
          >
            <div className="lg:col-span-1">
              <InlineSidebarFilter brands={brands} />
            </div>
          </Suspense>

          <div className="lg:col-span-3">
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {filters.brand ? `${filters.brand} Cars` : "Browse All Cars"}
                </h1>
                <p className="mt-1 text-zinc-500">
                  {total} vehicle{total !== 1 ? "s" : ""} found
                </p>
              </div>
              <Suspense
                fallback={
                  <div className="h-[72px] w-full max-w-[220px] animate-pulse rounded-md border border-zinc-800 bg-zinc-900/60 sm:ml-auto" />
                }
              >
                <CarsMarketplaceSort />
              </Suspense>
            </div>

            {vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Car className="mb-4 h-16 w-16 text-zinc-700" />
                <h2 className="mb-2 text-xl font-semibold text-zinc-300">
                  No vehicles found
                </h2>
                <p className="max-w-md text-zinc-500">
                  Try adjusting your filters or search for a different brand.
                </p>
              </div>
            ) : (
              <>
                <CarGrid
                  vehicles={vehicles}
                  savedIds={savedIds}
                  isLoggedIn={isLoggedIn}
                />
                <Pagination currentPage={page} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
