import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import {
  getBrandFacets,
  getBrandsAlphabetical,
  getMarketBounds,
  getModelsForBrands,
} from "@/lib/data/facets";
import {
  getRelaxations,
  getVehicles,
  type ListVehicle,
} from "@/lib/data/vehicles";
import { searchVehicleIds } from "@/lib/data/search";
import { getSavedVehicleIds, getSessionUser } from "@/lib/data/session";
import { filtersFromSearchParams, readList } from "@/lib/filter-params";
import { vehicleFilterSchema } from "@/lib/validations/vehicle";
import { formatNumber } from "@/lib/vehicle-format";
import CarGrid from "@/components/cars/car-grid";
import CarGridSkeleton from "@/components/cars/car-grid-skeleton";
import Pagination from "@/components/cars/pagination";
import ActiveFilterChips from "@/components/cars/filters/active-filter-chips";
import FilterPanel from "@/components/cars/filters/filter-panel";
import MobileFilters from "@/components/cars/filters/mobile-filters";
import SearchInput from "@/components/cars/filters/search-input";
import SortSelect from "@/components/cars/filters/sort-select";
import SaveSearchButton from "@/components/cars/filters/save-search-button";
import ClearFiltersLink from "@/components/cars/filters/clear-filters-link";

export const metadata: Metadata = {
  title: "Browse cars for sale in Jordan",
  description:
    "Search cars for sale across Jordan by price in JOD, mileage, year, body type and agency-import status. Message the seller directly on WhatsApp.",
  // Filter combinations are query strings on one page; point them all at the
  // canonical listing so crawlers do not treat each as a separate document.
  alternates: { canonical: "/cars" },
};

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Listing page.
 *
 * The shell — heading, search box, filter sidebar — renders from cached facet
 * data and does not depend on the request, so it prerenders. Only the results
 * read searchParams, and they sit behind their own Suspense boundary, so the
 * page paints immediately and the grid streams in.
 */
export default function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-page px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="font-display text-h2 text-ink">Cars for sale</h1>
          <p className="mt-1 text-body-sm text-ink-3">
            Every listing shows mileage, spec origin and agency-import status.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput className="flex-1" />
            <SortSelect />
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-surface pt-3 lg:hidden">
        <Suspense fallback={<div className="h-16" />}>
          <MobileFilterSlot searchParams={searchParams} />
        </Suspense>
      </div>

      <div className="mx-auto flex max-w-page items-start gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <a
          href="#results"
          className="sr-only rounded-control bg-brand px-4 py-2 text-body-sm font-semibold text-brand-ink focus:not-sr-only focus:absolute focus:z-[60]"
        >
          Skip filters, go to results
        </a>
        <aside className="sticky top-[calc(var(--spacing-header)+1.5rem)] hidden w-sidebar shrink-0 lg:block">
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="border-b border-line px-4 py-3">
              <h2 className="text-body font-semibold text-ink">Filters</h2>
            </div>
            <div className="scrollbar-thin max-h-[calc(100vh-12rem)] overflow-y-auto">
              <Suspense fallback={<FilterSkeleton />}>
                <SidebarFilterSlot searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </aside>

        <section id="results" aria-label="Search results" className="min-w-0 flex-1">
          <ActiveFilterChips />
          <Suspense fallback={<ResultsFallback />}>
            <Results searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

/* ─── Filter slots ──────────────────────────────────────────────────────
   Facets are cached; the model list depends on which brands are selected,
   so these read searchParams and stream in behind their own boundary.
   ─────────────────────────────────────────────────────────────────────── */

async function loadFacets(searchParams: Promise<SearchParams>) {
  const raw = await searchParams;
  const selectedBrands = readList(
    new URLSearchParams(
      Object.entries(raw)
        .filter(([, v]) => typeof v === "string")
        .map(([k, v]) => [k, v as string])
    ),
    "brand"
  );

  const [bounds, models] = await Promise.all([
    getMarketBounds(),
    getModelsForBrands(selectedBrands),
  ]);
  return { bounds, models };
}

async function SidebarFilterSlot({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [brands, { bounds, models }] = await Promise.all([
    getBrandsAlphabetical(),
    loadFacets(searchParams),
  ]);
  return <FilterPanel brands={brands} bounds={bounds} models={models} />;
}

async function MobileFilterSlot({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [brands, { bounds, models }] = await Promise.all([
    getBrandFacets(),
    loadFacets(searchParams),
  ]);
  return <MobileFilters brands={brands} bounds={bounds} models={models} />;
}

/* ─── Results (depends on the request) ──────────────────────────────── */

async function Results({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const filters = vehicleFilterSchema.parse(filtersFromSearchParams(raw));

  // A keyword search narrows to a ranked id set first, then the normal
  // filters apply on top of it.
  if (filters.q) {
    const ids = await searchVehicleIds(filters.q);
    if (ids.length === 0) {
      return <NoResults searchParams={raw} query={filters.q} />;
    }
    filters.ids = ids;
  }

  const [{ vehicles, featured, total, page, totalPages }, savedIds, user] =
    await Promise.all([
      getVehicles(filters),
      getSavedVehicleIds(),
      getSessionUser(),
    ]);

  const all: ListVehicle[] = [...featured, ...vehicles];

  if (all.length === 0) {
    return <NoResults searchParams={raw} query={filters.q} />;
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-ink-2" aria-live="polite">
          <span className="font-semibold text-ink tabular-nums">
            {formatNumber(total)}
          </span>{" "}
          {total === 1 ? "car" : "cars"}
          {filters.q ? ` matching “${filters.q}”` : ""}
        </p>
        <SaveSearchButton
          isLoggedIn={Boolean(user)}
          suggestedName={suggestSearchName(filters, raw)}
        />
      </div>

      <CarGrid
        vehicles={all}
        savedIds={savedIds}
        isLoggedIn={Boolean(user)}
        featuredIds={featured.map((v) => v.id)}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        searchParams={raw}
      />
    </>
  );
}

/**
 * Empty state that does actual work: it says which single filter to drop and
 * how many cars that brings back, instead of "try adjusting your filters".
 */
async function NoResults({
  searchParams,
  query,
}: {
  searchParams: SearchParams;
  query?: string;
}) {
  const filters = vehicleFilterSchema.parse(
    filtersFromSearchParams(searchParams)
  );
  const relaxations = await getRelaxations(filters);

  return (
    <div className="rounded-card border border-line bg-surface px-6 py-14 text-center">
      <SearchX
        className="mx-auto mb-4 h-10 w-10 text-ink-3"
        aria-hidden="true"
      />
      <h2 className="text-title font-semibold text-ink">
        No cars match {query ? `“${query}”` : "these filters"}
      </h2>

      {relaxations.length > 0 ? (
        <>
          <p className="mx-auto mt-2 max-w-prose text-body-sm text-ink-3">
            Removing one filter brings results back:
          </p>
          <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2">
            {relaxations.map((r) => (
              <li key={r.key}>
                <ClearFiltersLink
                  keys={[r.key]}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-control border border-line-control bg-surface px-4 text-body-sm text-ink transition-colors hover:bg-surface-2"
                >
                  <span>Drop {r.label}</span>
                  <span className="font-semibold tabular-nums text-brand-strong">
                    {formatNumber(r.count)} cars
                  </span>
                </ClearFiltersLink>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mx-auto mt-2 max-w-prose text-body-sm text-ink-3">
          Nothing on the site matches this combination yet.
        </p>
      )}

      <div className="mt-6">
        <ClearFiltersLink className="text-body-sm font-semibold text-brand-strong hover:underline">
          Clear all filters
        </ClearFiltersLink>
      </div>
    </div>
  );
}

/**
 * A sensible default name for a saved search, built from what the buyer
 * actually filtered on, so they are not staring at an empty text box.
 */
function suggestSearchName(
  filters: ReturnType<typeof vehicleFilterSchema.parse>,
  raw: SearchParams
): string {
  const parts: string[] = [];
  if (filters.q) parts.push(filters.q);
  if (filters.brand?.length) parts.push(filters.brand.join(", "));
  if (filters.bodyType?.length) parts.push(filters.bodyType.join(", ").toLowerCase());
  if (filters.maxPrice) parts.push(`under ${formatNumber(filters.maxPrice)} JOD`);
  if (filters.agency) parts.push("agency import");

  const name = parts.join(" · ");
  if (name) return name.slice(0, 60);
  return typeof raw.dealer === "string" ? `Cars from ${raw.dealer}` : "All cars";
}

/* ─── Fallbacks ─────────────────────────────────────────────────────── */

function ResultsFallback() {
  return (
    <>
      <div
        aria-hidden="true"
        className="mb-4 h-5 w-28 animate-pulse rounded bg-surface-2"
      />
      <CarGridSkeleton />
    </>
  );
}

function FilterSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-24 animate-pulse rounded bg-surface-2" />
          <div className="h-9 w-full animate-pulse rounded-control bg-surface-2" />
        </div>
      ))}
    </div>
  );
}

