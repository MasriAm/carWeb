import { Suspense } from "react";
import {
  getVehicles,
  getDistinctBrands,
  getSavedVehicleIds,
} from "@/lib/actions/vehicles";
import { auth } from "@/lib/auth";
import SidebarFilter from "@/components/cars/sidebar-filter";
import CarCard from "@/components/cars/car-card";
import Pagination from "@/components/cars/pagination";
import type { VehicleFilterInput } from "@/lib/validations/vehicle";
import { Car } from "lucide-react";

export const metadata = {
  title: "Cars — Royal Cars",
  description: "Browse all luxury vehicles available in Jordan.",
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
    originSpec: str("originSpec") as VehicleFilterInput["originSpec"],
    sortBy: (str("sortBy") as VehicleFilterInput["sortBy"]) ?? "newest",
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
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            {filters.brand
              ? `${filters.brand} Cars`
              : "Browse All Cars"}
          </h1>
          <p className="text-neutral-500 mt-1">
            {total} vehicle{total !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-[280px] shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-xl border border-neutral-200 p-5">
              <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 rounded" />}>
                <SidebarFilter brands={brands} />
              </Suspense>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Car className="h-16 w-16 text-neutral-300 mb-4" />
                <h2 className="text-xl font-semibold text-neutral-700 mb-2">
                  No vehicles found
                </h2>
                <p className="text-neutral-500 max-w-md">
                  Try adjusting your filters or search for a different brand.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((v) => (
                    <CarCard
                      key={v.id}
                      vehicle={v}
                      isSaved={savedIds.includes(v.id)}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>

                <Pagination currentPage={page} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
