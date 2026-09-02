"use client";

import { useState } from "react";
import { Sliders } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CONDITION_OPTIONS,
  FUEL_OPTIONS,
  FilterSections,
  useCarFilters,
} from "./sidebar-filter";

/**
 * Mobile quick-filter bar. Horizontally scrolling row of pills plus an
 * "All Filters" button that opens a bottom sheet with the full filter body.
 * Stays in sync with the desktop sidebar via shared URL searchParams.
 */
export default function HorizontalFilter({
  brands,
  resultsCount,
}: {
  brands: string[];
  resultsCount: number;
}) {
  const {
    filters,
    setFilters,
    setFiltersLocal,
    commit,
    activeCount,
  } = useCarFilters();
  const [open, setOpen] = useState(false);

  const quickFuels = FUEL_OPTIONS.filter(
    (f) => f.value === "ELECTRIC" || f.value === "DIESEL"
  );

  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-2.5 overflow-x-auto border-b border-line bg-canvas px-4 py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:border-line-control"
        >
          <Sliders className="h-3.5 w-3.5" />
          All Filters
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-brand px-1.5 py-px text-caption font-extrabold leading-4 text-brand-ink">
              {activeCount}
            </span>
          )}
        </button>

        <span className="h-6 w-px shrink-0 bg-surface-2" aria-hidden="true" />

        {CONDITION_OPTIONS.map((c) => {
          const active = filters.condition === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  condition: f.condition === c.value ? "" : c.value,
                }))
              }
              className={cn(
                "shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-brand bg-brand-soft text-brand-strong"
                  : "border-line bg-surface text-ink-3 hover:border-line-control hover:text-ink-2"
              )}
            >
              {c.label}
            </button>
          );
        })}

        {quickFuels.map((f) => {
          const active = filters.fuelType === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() =>
                setFilters((cur) => ({
                  ...cur,
                  fuelType: cur.fuelType === f.value ? "" : f.value,
                }))
              }
              className={cn(
                "shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors",
                active
                  ? "border-brand bg-brand-soft text-brand-strong"
                  : "border-line bg-surface text-ink-3 hover:border-line-control hover:text-ink-2"
              )}
            >
              {f.label}
            </button>
          );
        })}

        <span className="ml-1.5 shrink-0 whitespace-nowrap text-xs text-ink-3">
          {resultsCount} result{resultsCount !== 1 ? "s" : ""}
        </span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="scrollbar-dark max-h-[90vh] overflow-y-auto rounded-t-2xl border-t border-line bg-canvas p-0"
        >
          <SheetHeader className="px-6 pb-3 pt-4">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-surface-2" />
            <SheetTitle className="text-base font-bold text-ink">
              All Filters
            </SheetTitle>
          </SheetHeader>

          <div className="pb-6">
            <FilterSections
              brands={brands}
              filters={filters}
              setFilters={setFilters}
              setFiltersLocal={setFiltersLocal}
              commit={commit}
            />
            <div className="px-6 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-12 w-full rounded-xl bg-brand text-sm font-bold text-brand-ink hover:bg-brand-hover"
              >
                Show {resultsCount} Result{resultsCount !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
