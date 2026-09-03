"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { BrandFacet } from "@/lib/data/facets";
import type { MarketBounds } from "@/lib/data/facets";
import {
  clearFilters,
  readList,
  setOrDelete,
  toggleInList,
} from "@/lib/filter-params";
import { kmStops, priceStops } from "@/lib/filter-scale";
import { formatNumber } from "@/lib/vehicle-format";
import { cn } from "@/lib/utils";
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

/** Multi-select chip. Toggles a value inside a comma list in the URL. */
function Chip({
  label,
  active,
  count,
  onToggle,
}: {
  label: string;
  active: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-body-sm transition-colors",
        active
          ? "border-brand bg-brand-soft font-semibold text-ink"
          : "border-line-control bg-surface text-ink-2 hover:border-ink-3 hover:text-ink"
      )}
    >
      {active && <Check className="h-3.5 w-3.5 text-brand-strong" aria-hidden="true" />}
      {label}
      {count != null && (
        <span className="text-caption text-ink-3 tabular-nums">{count}</span>
      )}
    </button>
  );
}

export default function FilterPanel({
  brands,
  bounds,
  models,
  onApplied,
}: {
  brands: BrandFacet[];
  bounds: MarketBounds;
  models: { model: string; count: number }[];
  onApplied?: () => void;
}) {
  const { searchParams, commit, commitDebounced } = useFilterNav();
  const [showAllBrands, setShowAllBrands] = useState(false);

  const selected = useMemo(
    () => ({
      brand: readList(searchParams, "brand"),
      model: readList(searchParams, "model"),
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

  const visibleBrands = showAllBrands ? brands : brands.slice(0, 12);

  const toggle = (key: string, value: string) => {
    commit((p) => toggleInList(p, key, value));
    onApplied?.();
  };

  return (
    <div className="px-4">
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
        {brands.length > 12 && (
          <button
            type="button"
            onClick={() => setShowAllBrands((v) => !v)}
            className="mt-2.5 text-body-sm font-semibold text-brand-strong hover:underline"
          >
            {showAllBrands
              ? "Show fewer brands"
              : `Show all ${brands.length} brands`}
          </button>
        )}
      </FilterSection>

      {models.length > 0 && (
        <FilterSection title="Model" count={selected.model.length}>
          <div className="scrollbar-thin flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
            {models.map((m) => (
              <Chip
                key={m.model}
                label={m.model}
                count={m.count}
                active={selected.model.includes(m.model)}
                onToggle={() => toggle("model", m.model)}
              />
            ))}
          </div>
        </FilterSection>
      )}

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

export { formatNumber };
