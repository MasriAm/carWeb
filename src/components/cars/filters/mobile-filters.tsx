"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { BrandFacet, MarketBounds } from "@/lib/data/facets";
import { activeFilterCount, toggleInList, setOrDelete } from "@/lib/filter-params";
import { formatNumber } from "@/lib/vehicle-format";
import { cn } from "@/lib/utils";
import FilterPanel from "./filter-panel";
import { useFilterNav } from "./use-filter-nav";

/** The handful of filters worth a one-tap shortcut on a phone. */
const QUICK = [
  { key: "bodyType", value: "SUV", label: "SUV" },
  { key: "bodyType", value: "SEDAN", label: "Sedan" },
  { key: "agency", value: "1", label: "Agency import" },
  { key: "fuelType", value: "HYBRID", label: "Hybrid" },
  { key: "condition", value: "NEW", label: "New" },
] as const;

export default function MobileFilters({
  brands,
  bounds,
  models,
}: {
  brands: BrandFacet[];
  bounds: MarketBounds;
  models: { model: string; count: number }[];
}) {
  const { searchParams, commit } = useFilterNav();
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(searchParams);
  const liveCount = useLiveCount(searchParams.toString(), open);

  return (
    <div className="lg:hidden">
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 pb-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-10 shrink-0 gap-2 border-line-control"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {count > 0 && (
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-caption font-bold leading-none text-brand-ink">
              {count}
            </span>
          )}
        </Button>

        <span className="h-6 w-px shrink-0 bg-line" aria-hidden="true" />

        {QUICK.map((q) => {
          const active =
            q.key === "agency"
              ? searchParams.get("agency") === "1"
              : (searchParams.get(q.key) ?? "").split(",").includes(q.value);
          return (
            <button
              key={`${q.key}-${q.value}`}
              type="button"
              aria-pressed={active}
              onClick={() =>
                commit((p) => {
                  if (q.key === "agency") {
                    setOrDelete(p, "agency", active ? null : "1");
                  } else {
                    toggleInList(p, q.key, q.value);
                  }
                })
              }
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 text-body-sm transition-colors",
                active
                  ? "border-brand bg-brand-soft font-semibold text-ink"
                  : "border-line-control bg-surface text-ink-2"
              )}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[88vh] flex-col rounded-t-panel bg-surface p-0"
        >
          <SheetHeader className="border-b border-line px-4 py-3">
            <SheetTitle className="text-lead text-ink">Filters</SheetTitle>
          </SheetHeader>

          <div className="scrollbar-thin flex-1 overflow-y-auto">
            <FilterPanel brands={brands} bounds={bounds} models={models} />
          </div>

          <div className="border-t border-line bg-surface p-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="h-12 w-full text-body font-semibold"
            >
              {liveCount == null
                ? "Show results"
                : `Show ${formatNumber(liveCount)} ${liveCount === 1 ? "car" : "cars"}`}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/**
 * Live count for the sheet's primary button. The sheet covers the results, so
 * without this the button would be asking the buyer to close it to find out
 * whether the selection returns anything.
 */
function useLiveCount(query: string, enabled: boolean) {
  const [result, setResult] = useState<{ query: string; count: number } | null>(
    null
  );

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    fetch(`/api/vehicles/count?${query}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.count === "number") {
          setResult({ query, count: data.count });
        }
      })
      .catch(() => {
        /* Aborted or offline: the button falls back to "Show results". */
      });

    return () => controller.abort();
  }, [query, enabled]);

  // A count fetched for a previous filter set is worse than no count.
  return result && result.query === query ? result.count : null;
}
