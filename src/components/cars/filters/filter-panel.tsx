"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { BrandFacet, MarketBounds } from "@/lib/data/facets";
import {
  clearFilters,
  readList,
  setOrDelete,
  toggleInList,
} from "@/lib/filter-params";
import { kmStops, priceStops } from "@/lib/filter-scale";
import { cn } from "@/lib/utils";
import Chip from "./filter-chip";
import FilterSection from "./filter-section";
import RangeFilter from "./range-filter";
import { useFilterNav } from "./use-filter-nav";

const BODY_OPTIONS = [
  { value: "SUV", label: "SUV" },
  { value: "SEDAN", label: "Sedan" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "PICKUP", label: "Pickup" },
  { value: "COUPE", label: "Coupe" },
  { value: "VAN", label: "Van" },
  { value: "WAGON", label: "Wagon" },
  { value: "CONVERTIBLE", label: "Convertible" },
];

const FUEL_OPTIONS = [
  { value: "GAS", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ELECTRIC", label: "Electric" },
];

const CONDITION_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
];

const TRANSMISSION_OPTIONS = [
  { value: "AUTO", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
];

const SPEC_OPTIONS = [
  { value: "GCC", label: "Gulf" },
  { value: "US", label: "US" },
  { value: "EU", label: "European" },
  { value: "KOREAN", label: "Korean" },
  { value: "JAPANESE", label: "Japanese" },
  { value: "OTHER", label: "Other" },
];

/**
 * How many brands the collapsed list shows. The full list runs to every brand
 * on the site, which buries the price and body-type filters below the fold on
 * a phone; the ones worth surfacing unprompted are the ones with stock.
 */
const COLLAPSED_BRANDS = 8;

export default function FilterPanel({
  brands,
  bounds,
  modelSlot,
  onApplied,
}: {
  brands: BrandFacet[];
  bounds: MarketBounds;
  modelSlot?: React.ReactNode;
  onApplied?: () => void;
}) {
  const { searchParams, commit, commitDebounced, isPending } = useFilterNav();
  const [showAllBrands, setShowAllBrands] = useState(false);

  const selected = useMemo(
    () => ({
      brand: readList(searchParams, "brand"),
      bodyType: readList(searchParams, "bodyType"),
      fuelType: readList(searchParams, "fuelType"),
      condition: readList(searchParams, "condition"),
      specOrigin: readList(searchParams, "specOrigin"),
      transmission: searchParams.get("transmission") ?? "",
      agency: searchParams.get("agency") === "1",
      includeSold: searchParams.get("includeSold") === "1",
      minPrice: numberOrUndefined(searchParams.get("minPrice")),
      maxPrice: numberOrUndefined(searchParams.get("maxPrice")),
      minYear: numberOrUndefined(searchParams.get("minYear")),
      maxYear: numberOrUndefined(searchParams.get("maxYear")),
      maxKm: numberOrUndefined(searchParams.get("maxKm")),
    }),
    [searchParams]
  );

  const pStops = useMemo(() => priceStops(bounds.maxPrice), [bounds.maxPrice]);
  const kStops = useMemo(() => kmStops(bounds.maxKm), [bounds.maxKm]);
  const yearStops = useMemo(() => {
    const out: number[] = [];
    for (let y = bounds.minYear; y <= bounds.maxYear; y++) out.push(y);
    return out.length > 1 ? out : [bounds.minYear, bounds.minYear + 1];
  }, [bounds.minYear, bounds.maxYear]);

  /**
   * Collapsed, the list is the brands with the most cars — the first eight
   * alphabetically say nothing about what is actually for sale. A selected
   * brand is always kept on screen, or collapsing the list would hide a
   * filter that is still applied.
   */
  const visibleBrands = useMemo(() => {
    if (showAllBrands) return brands;
    const top = [...brands]
      .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand))
      .slice(0, COLLAPSED_BRANDS);
    const shown = new Set(top.map((b) => b.brand));
    const pinned = brands.filter(
      (b) => selected.brand.includes(b.brand) && !shown.has(b.brand)
    );
    return [...top, ...pinned].sort((a, b) => a.brand.localeCompare(b.brand));
  }, [brands, showAllBrands, selected.brand]);

  const toggle = (key: string, value: string) => {
    commit((p) => toggleInList(p, key, value));
    onApplied?.();
  };

  return (
    <div
      aria-busy={isPending}
      className={cn(
        "px-4 transition-opacity duration-150",
        isPending && "opacity-60"
      )}
    >
      <FilterSection title="Brand" count={selected.brand.length}>
        <div className="flex flex-wrap gap-1.5">
          {visibleBrands.map((b) => (
            <Chip
              key={b.brand}
              label={b.brand}
              count={b.count}
              active={selected.brand.includes(b.brand)}
              onToggle={() => toggle("brand", b.brand)}
            />
          ))}
        </div>
        {brands.length > visibleBrands.length || showAllBrands ? (
          <button
            type="button"
            onClick={() => setShowAllBrands((v) => !v)}
            className="mt-2.5 text-body-sm font-semibold text-brand-strong hover:underline"
          >
            {showAllBrands
              ? "Show fewer brands"
              : `Show all ${brands.length} brands`}
          </button>
        ) : null}
      </FilterSection>

      {modelSlot}

      <FilterSection title="Price">
        <RangeFilter
          label="price"
          stops={pStops}
          min={selected.minPrice}
          max={selected.maxPrice}
          unit="JOD"
          onCommit={({ min, max }) => {
            commitDebounced((p) => {
              setOrDelete(p, "minPrice", min);
              setOrDelete(p, "maxPrice", max);
            }, 200);
            onApplied?.();
          }}
        />
      </FilterSection>

      <FilterSection title="Mileage">
        <RangeFilter
          label="mileage"
          stops={[0, ...kStops.slice(1)]}
          min={undefined}
          max={selected.maxKm}
          unit="km"
          maxPlaceholder="Any"
          onCommit={({ max }) => {
            commitDebounced((p) => setOrDelete(p, "maxKm", max), 200);
            onApplied?.();
          }}
        />
      </FilterSection>

      <FilterSection title="Year">
        <RangeFilter
          label="year"
          stops={yearStops}
          min={selected.minYear}
          max={selected.maxYear}
          onCommit={({ min, max }) => {
            commitDebounced((p) => {
              setOrDelete(p, "minYear", min);
              setOrDelete(p, "maxYear", max);
            }, 200);
            onApplied?.();
          }}
        />
      </FilterSection>

      <FilterSection title="Body type" count={selected.bodyType.length}>
        <div className="flex flex-wrap gap-1.5">
          {BODY_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selected.bodyType.includes(o.value)}
              onToggle={() => toggle("bodyType", o.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fuel" count={selected.fuelType.length}>
        <div className="flex flex-wrap gap-1.5">
          {FUEL_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selected.fuelType.includes(o.value)}
              onToggle={() => toggle("fuelType", o.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Condition" count={selected.condition.length}>
        <div className="flex flex-wrap gap-1.5">
          {CONDITION_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selected.condition.includes(o.value)}
              onToggle={() => toggle("condition", o.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission">
        <div className="flex flex-wrap gap-1.5">
          {TRANSMISSION_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selected.transmission === o.value}
              onToggle={() => {
                commit((p) =>
                  setOrDelete(
                    p,
                    "transmission",
                    selected.transmission === o.value ? null : o.value
                  )
                );
                onApplied?.();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Spec origin" count={selected.specOrigin.length}>
        <div className="flex flex-wrap gap-1.5">
          {SPEC_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selected.specOrigin.includes(o.value)}
              onToggle={() => toggle("specOrigin", o.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="More">
        <div className="space-y-3">
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={selected.agency}
              onCheckedChange={(checked) => {
                commit((p) => setOrDelete(p, "agency", checked ? "1" : null));
                onApplied?.();
              }}
            />
            <span className="text-body-sm text-ink-2">
              Agency import only{" "}
              <span className="text-ink-3" lang="ar" dir="rtl">
                (وارد وكالة)
              </span>
            </span>
          </label>

          <label className="flex min-h-11 cursor-pointer items-center gap-2.5">
            <Checkbox
              checked={selected.includeSold}
              onCheckedChange={(checked) => {
                commit((p) =>
                  setOrDelete(p, "includeSold", checked ? "1" : null)
                );
                onApplied?.();
              }}
            />
            <span className="text-body-sm text-ink-2">Include sold cars</span>
          </label>
        </div>
      </FilterSection>

      <div className="py-4">
        <button
          type="button"
          onClick={() => {
            commit(clearFilters);
            onApplied?.();
          }}
          className="text-body-sm font-semibold text-brand-strong hover:underline"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}

function numberOrUndefined(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
