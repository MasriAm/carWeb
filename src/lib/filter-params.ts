import type { VehicleFilterInput } from "@/lib/validations/vehicle";

/**
 * Filter state lives in the URL and nowhere else.
 *
 * A filtered search must survive a copy-pasted link and a refresh, so these
 * helpers are the only place that knows how filter state is encoded. Multi
 * values travel as comma lists (`?brand=BMW,Toyota`) because a Royal Cars
 * link is routinely pasted into WhatsApp, where repeated keys look like
 * noise.
 */

export type FilterKey =
  | "q"
  | "brand"
  | "model"
  | "bodyType"
  | "fuelType"
  | "condition"
  | "specOrigin"
  | "transmission"
  | "minPrice"
  | "maxPrice"
  | "minYear"
  | "maxYear"
  | "maxKm"
  | "agency"
  | "dealer"
  | "includeSold"
  | "sortBy";

export const MULTI_KEYS = [
  "brand",
  "model",
  "bodyType",
  "fuelType",
  "condition",
  "specOrigin",
] as const satisfies readonly FilterKey[];

/** Every key a "clear all" should remove, plus pagination. */
export const ALL_FILTER_KEYS: FilterKey[] = [
  "q",
  "brand",
  "model",
  "bodyType",
  "fuelType",
  "condition",
  "specOrigin",
  "transmission",
  "minPrice",
  "maxPrice",
  "minYear",
  "maxYear",
  "maxKm",
  "agency",
  "dealer",
  "includeSold",
];

export function readList(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}

export function writeList(
  params: URLSearchParams,
  key: string,
  values: string[]
) {
  const unique = Array.from(new Set(values.filter(Boolean)));
  if (unique.length) params.set(key, unique.join(","));
  else params.delete(key);
}

export function toggleInList(
  params: URLSearchParams,
  key: string,
  value: string
) {
  const current = readList(params, key);
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  writeList(params, key, next);
}

export function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string | number | boolean | null | undefined
) {
  if (
    value == null ||
    value === "" ||
    value === false ||
    (typeof value === "number" && Number.isNaN(value))
  ) {
    params.delete(key);
    return;
  }
  params.set(key, String(value));
}

/** Any filter change invalidates the current page number. */
export function resetPage(params: URLSearchParams) {
  params.delete("page");
}

export function clearFilters(params: URLSearchParams) {
  for (const key of ALL_FILTER_KEYS) params.delete(key);
  params.delete("page");
}

/**
 * Turn raw searchParams into the object the data layer expects.
 * Validation itself happens in the Zod schema; this only shapes the input.
 */
export function filtersFromSearchParams(
  raw: Record<string, string | string[] | undefined>
): Partial<VehicleFilterInput> {
  const one = (k: string) => {
    const v = raw[k];
    return Array.isArray(v) ? v[0] : v;
  };

  return {
    q: one("q"),
    brand: one("brand"),
    model: one("model"),
    bodyType: one("bodyType"),
    fuelType: one("fuelType"),
    condition: one("condition"),
    specOrigin: one("specOrigin"),
    transmission: one("transmission"),
    minPrice: one("minPrice"),
    maxPrice: one("maxPrice"),
    minYear: one("minYear"),
    maxYear: one("maxYear"),
    maxKm: one("maxKm"),
    agency: one("agency"),
    dealer: one("dealer"),
    includeSold: one("includeSold"),
    sortBy: one("sortBy"),
    page: one("page"),
  } as Partial<VehicleFilterInput>;
}

/** Count of applied filters, for the "Filters (3)" badge. */
export function activeFilterCount(params: URLSearchParams): number {
  return ALL_FILTER_KEYS.reduce((n, key) => {
    const value = params.get(key);
    if (!value) return n;
    if ((MULTI_KEYS as readonly string[]).includes(key)) {
      return n + readList(params, key).length;
    }
    return n + 1;
  }, 0);
}
