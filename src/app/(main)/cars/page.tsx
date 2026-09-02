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
      <div className="h-10 w-44 animate-pulse rounded-lg border border-line bg-surface/60" />
    ),
  }
);

const CarGrid = dynamic(() => import("@/components/cars/car-grid"), {
  loading: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-xl border border-line bg-surface/70"
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
    <section className="min-h-screen bg-canvas">
      {/* Page header */}
      <div className="border-b border-line bg-surface px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft">
              <Car className="h-4 w-4 text-brand-strong" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-none tracking-tight text-ink sm:text-xl">
                {filters.brand ? `${filters.brand} Cars` : "Vehicle Marketplace"}
              </h1>
              <p className="mt-1 text-caption text-ink-3">
                Jordan&apos;s leading luxury auto platform
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Suspense
              fallback={
                <div className="h-10 w-full animate-pulse rounded-lg border border-line bg-surface/60 sm:w-44" />
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
      <div className="mx-auto flex max-w-page items-start gap-5 px-4 pb-20 pt-5 sm:px-6">
        {/* Desktop sidebar */}
        <div className="sticky top-[calc(var(--spacing-header)+1rem)] hidden w-sidebar shrink-0 lg:block">
          <SidebarFilter brands={brands} resultsCount={total} />
        </div>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <ActiveFilterChips />

          <p className="mb-4 hidden text-xs text-ink-3 lg:block">
            <span className="font-semibold text-ink-2">{total}</span>{" "}
            vehicle{total !== 1 ? "s" : ""}
          </p>

          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Car className="mb-4 h-11 w-11 text-ink-3" />
              <h2 className="mb-1 text-base font-bold text-ink-2">
                No vehicles match your filters
              </h2>
              <p className="max-w-md text-sm text-ink-3">
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
