"use client";

import { X } from "lucide-react";
import {
  clearFilters,
  readList,
  setOrDelete,
  toggleInList,
} from "@/lib/filter-params";
import { formatNumber } from "@/lib/vehicle-format";
import {
  BODY_LABEL,
  CONDITION_LABEL,
  FUEL_LABEL,
  SPEC_ORIGIN_LABEL,
  TRANSMISSION_LABEL,
} from "@/lib/vehicle-format";
import { useFilterNav } from "./use-filter-nav";

type Tag = { key: string; label: string; clear: (p: URLSearchParams) => void };

/** Everything currently applied, each removable on its own. */
export default function ActiveFilterChips() {
  const { searchParams, commit } = useFilterNav();
  const tags: Tag[] = [];

  const listTag = (
    key: string,
    labels: Record<string, string> | null = null
  ) => {
    for (const value of readList(searchParams, key)) {
      tags.push({
        key: `${key}:${value}`,
        label: labels?.[value] ?? value,
        clear: (p) => toggleInList(p, key, value),
      });
    }
  };

  const q = searchParams.get("q");
  if (q) {
    tags.push({
      key: "q",
      label: `“${q}”`,
      clear: (p) => setOrDelete(p, "q", null),
    });
  }

  listTag("brand");
  listTag("model");
  listTag("bodyType", BODY_LABEL);
  listTag("fuelType", FUEL_LABEL);
  listTag("condition", CONDITION_LABEL);
  listTag("specOrigin", SPEC_ORIGIN_LABEL);

  const transmission = searchParams.get("transmission");
  if (transmission) {
    tags.push({
      key: "transmission",
      label: TRANSMISSION_LABEL[transmission] ?? transmission,
      clear: (p) => setOrDelete(p, "transmission", null),
    });
  }

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    const from = minPrice ? formatNumber(Number(minPrice)) : "Any";
    const to = maxPrice ? formatNumber(Number(maxPrice)) : "Any";
    tags.push({
      key: "price",
      label: `${from} – ${to} JOD`,
      clear: (p) => {
        p.delete("minPrice");
        p.delete("maxPrice");
      },
    });
  }

  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  if (minYear || maxYear) {
    tags.push({
      key: "year",
      label: `${minYear ?? "Any"} – ${maxYear ?? "Any"}`,
      clear: (p) => {
        p.delete("minYear");
        p.delete("maxYear");
      },
    });
  }

  const maxKm = searchParams.get("maxKm");
  if (maxKm) {
    tags.push({
      key: "maxKm",
      label: `Under ${formatNumber(Number(maxKm))} km`,
      clear: (p) => setOrDelete(p, "maxKm", null),
    });
  }

  if (searchParams.get("agency") === "1") {
    tags.push({
      key: "agency",
      label: "Agency import",
      clear: (p) => setOrDelete(p, "agency", null),
    });
  }

  if (searchParams.get("includeSold") === "1") {
    tags.push({
      key: "includeSold",
      label: "Including sold",
      clear: (p) => setOrDelete(p, "includeSold", null),
    });
  }

  const dealer = searchParams.get("dealer");
  if (dealer) {
    tags.push({
      key: "dealer",
      label: `Dealer: ${dealer}`,
      clear: (p) => setOrDelete(p, "dealer", null),
    });
  }

  if (tags.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <button
          key={tag.key}
          type="button"
          onClick={() => commit(tag.clear)}
          aria-label={`Remove filter ${tag.label}`}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-brand/40 bg-brand-soft px-3 text-body-sm font-medium text-ink transition-colors hover:border-brand"
        >
          {tag.label}
          <X className="h-3.5 w-3.5 text-ink-3" aria-hidden="true" />
        </button>
      ))}
      {tags.length > 1 && (
        <button
          type="button"
          onClick={() => commit(clearFilters)}
          className="min-h-8 px-2 text-body-sm font-semibold text-brand-strong hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
