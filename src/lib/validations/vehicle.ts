import { z } from "zod";

export const VehicleStatusEnum = z.enum(["ON_SALE", "SOLD"]);
export const ConditionEnum = z.enum(["NEW", "USED"]);
export const BodyTypeEnum = z.enum([
  "SUV", "SEDAN", "COUPE", "HATCHBACK", "CONVERTIBLE", "PICKUP", "VAN", "WAGON",
]);
export const TransmissionEnum = z.enum(["AUTO", "MANUAL"]);
export const FuelTypeEnum = z.enum(["GAS", "ELECTRIC", "DIESEL", "HYBRID"]);
export const SpecOriginEnum = z.enum([
  "GCC", "US", "EU", "KOREAN", "JAPANESE", "OTHER",
]);

export const createVehicleSchema = z.object({
  dealershipId: z.string().cuid().optional(),

  videoUrl: z.string().url().optional().or(z.literal("")),
  instagramVideoUrl: z.string().url().optional().or(z.literal("")),
  imageUrls: z.array(z.string().url()).min(1, "At least one image is required"),

  brand: z.string().min(1, "Brand is required").max(50),
  model: z.string().min(1, "Model is required").max(100),
  price: z.number().int().positive("Price must be positive").max(10_000_000),
  shortDescription: z.string().min(10, "Description must be at least 10 characters").max(500),

  condition: ConditionEnum,
  bodyType: BodyTypeEnum,
  transmission: TransmissionEnum,
  engineCapacityCC: z.number().int().min(0).max(15000),
  fuelType: FuelTypeEnum,
  mileageKm: z.number().int().min(0),
  productionYear: z.number().int().min(1970).max(new Date().getFullYear() + 1),

  fa7s: z.string().max(5000).optional().or(z.literal("")),
  waredWakaleh: z.boolean().optional().default(false),
  specOrigin: SpecOriginEnum.optional().nullable(),

  detailedSpecs: z.array(z.string()).optional().default([]),
  specificWhatsapp: z.string().max(20).optional().or(z.literal("")),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: VehicleStatusEnum.optional(),
  isPromoted: z.boolean().optional(),
});

/* ─── Filters ──────────────────────────────────────────────────────────
   Filter state is URL state. Multi-select values travel as comma lists
   (`?brand=BMW,Mercedes-Benz`) rather than repeated keys, because a
   Royal Cars link is routinely pasted into a WhatsApp message and a
   comma list stays readable there. Both forms parse, so older links with
   a single value keep working.

   Each key validates independently. A single unrecognised value must
   drop only itself: the previous schema failed the whole object, which
   silently returned every vehicle while the URL and the filter chips
   still claimed a filter was applied.
   ──────────────────────────────────────────────────────────────────── */

function splitCsv(v: string | string[]): string[] {
  const parts = (Array.isArray(v) ? v : [v])
    .flatMap((s) => String(s).split(","))
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(parts));
}

/** Accepts "a,b", ["a","b"] or "a"; drops blanks and duplicates. */
function csv(maxLength: number) {
  return z
    .union([z.string(), z.array(z.string())])
    .transform((v) => splitCsv(v).filter((s) => s.length <= maxLength))
    .optional() as z.ZodType<string[] | undefined, string | string[] | undefined>;
}

/** Same, but keeps only values the enum recognises instead of failing. */
function csvEnum<const T extends readonly [string, ...string[]]>(
  values: T
) {
  const allowed = new Set<string>(values);
  return z
    .union([z.string(), z.array(z.string())])
    .transform((v) =>
      splitCsv(v)
        .map((s) => s.toUpperCase())
        .filter((s) => allowed.has(s))
    )
    .optional() as z.ZodType<
    T[number][] | undefined,
    string | string[] | undefined
  >;
}

const boolParam = z
  .union([z.string(), z.boolean()])
  .transform((v) =>
    typeof v === "boolean" ? v : ["1", "true", "yes", "on"].includes(v.toLowerCase())
  )
  .catch(false)
  .optional();

const intParam = (min: number, max: number) =>
  z.coerce.number().int().min(min).max(max).catch(undefined as never).optional();

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "year_desc", label: "Year: newest first" },
  { value: "mileage_asc", label: "Mileage: lowest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

export const SortEnum = z.enum([
  "newest",
  "price_asc",
  "price_desc",
  "year_desc",
  "mileage_asc",
  "oldest",
]);

export const vehicleFilterSchema = z.object({
  /** Free-text search across brand, model and description. */
  q: z.string().trim().max(120).catch("").optional(),

  brand: csv(50),
  model: csv(100),
  bodyType: csvEnum(["SUV","SEDAN","COUPE","HATCHBACK","CONVERTIBLE","PICKUP","VAN","WAGON"] as const),
  fuelType: csvEnum(["GAS","ELECTRIC","DIESEL","HYBRID"] as const),
  condition: csvEnum(["NEW","USED"] as const),
  specOrigin: csvEnum(["GCC","US","EU","KOREAN","JAPANESE","OTHER"] as const),
  transmission: TransmissionEnum.catch(undefined as never).optional(),

  minPrice: intParam(0, 10_000_000),
  maxPrice: intParam(0, 10_000_000),
  minYear: intParam(1970, 2100),
  maxYear: intParam(1970, 2100),
  maxKm: intParam(0, 2_000_000),

  /** Agency import (وارد وكالة) only. */
  agency: boolParam,
  /** Restrict to one dealership, by slug. */
  dealer: z.string().max(100).catch("").optional(),
  /** Sold listings are excluded unless this is set. */
  includeSold: boolParam,

  /** Internal: restrict to a set of ids (used by full-text search). */
  ids: z.array(z.string()).optional(),

  sortBy: SortEnum.catch("newest").default("newest"),
  page: z.coerce.number().int().min(1).max(10_000).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).catch(12).default(12),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>;
export type SortValue = z.infer<typeof SortEnum>;
