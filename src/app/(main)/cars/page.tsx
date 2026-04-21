import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  getVehicles,
  getDistinctBrands,
  getSavedVehicleIds,
} from "@/lib/actions/vehicles";
import { auth } from "@/lib/auth";
import SidebarFilter, {
  ActiveFilterChips,
} from "@/components/cars/sidebar-filter";
import HorizontalFilter from "@/components/cars/horizontal-filter";
import type { VehicleFilterInput } from "@/lib/validations/vehicle";
import { Car } from "lucide-react";

const CarsMarketplaceSort = dynamic(
  () => import("@/components/cars/cars-marketplace-sort"),
  {
    loading: () => (
      <div className="h-10 w-[180px] animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60" />
    ),
  }
);

const CarGrid = dynamic(() => import("@/components/cars/car-grid"), {
  loading: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[min(28rem,72vw)] animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/70"
        />
      ))}
    </div>
  ),
});

import Pagination from "@/components/cars/pagination";

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
    <section className="min-h-screen bg-zinc-950 pt-16">
      {/* Page header */}
      <div className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
              <Car className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-none tracking-tight text-white sm:text-xl">
                {filters.brand ? `${filters.brand} Cars` : "Vehicle Marketplace"}
              </h1>
              <p className="mt-1 text-[11px] text-zinc-500">
                Jordan&apos;s leading luxury auto platform
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Suspense
              fallback={
                <div className="h-10 w-full animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60 sm:w-[180px]" />
              }
            >
              <CarsMarketplaceSort />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile filter bar */}
      <HorizontalFilter brands={brands} resultsCount={total} />

      {/* Body */}
      <div className="mx-auto flex max-w-[1440px] items-start gap-5 px-4 pb-20 pt-5 sm:px-6">
        {/* Desktop sidebar */}
        <div className="sticky top-[88px] hidden w-[268px] shrink-0 lg:block">
          <SidebarFilter brands={brands} resultsCount={total} />
        </div>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <ActiveFilterChips />

          <p className="mb-4 hidden text-xs text-zinc-500 lg:block">
            <span className="font-semibold text-zinc-300">{total}</span>{" "}
            vehicle{total !== 1 ? "s" : ""}
          </p>

          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Car className="mb-4 h-11 w-11 text-zinc-700" />
              <h2 className="mb-1 text-base font-bold text-zinc-300">
                No vehicles match your filters
              </h2>
              <p className="max-w-md text-sm text-zinc-500">
                Try adjusting your price range or removing some filters.
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
    </section>
  );
}
