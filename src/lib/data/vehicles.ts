import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  vehicleFilterSchema,
  type VehicleFilterInput,
} from "@/lib/validations/vehicle";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Read layer for vehicle data.
 *
 * These are plain async functions, not server actions. A `"use server"` file
 * exposes every export as an anonymous POST endpoint; read functions have no
 * business being reachable that way.
 *
 * Each one is cached indefinitely and invalidated by tag from
 * `revalidateVehicleData()`, so listing pages stop re-querying on every render.
 */

/** Minimal shape for grid cards — keeps the RSC payload small. */
export const listSelect = {
  id: true,
  status: true,
  videoUrl: true,
  imageUrls: true,
  brand: true,
  model: true,
  price: true,
  shortDescription: true,
  condition: true,
  bodyType: true,
  transmission: true,
  engineCapacityCC: true,
  fuelType: true,
  mileageKm: true,
  productionYear: true,
  isPromoted: true,
  waredWakaleh: true,
  specOrigin: true,
  specificWhatsapp: true,
  publicationDate: true,
  dealership: {
    select: { name: true, slug: true, whatsappNumber: true, phone: true },
  },
  user: { select: { name: true, phone: true } },
} satisfies Prisma.VehicleSelect;

export type ListVehicle = Prisma.VehicleGetPayload<{
  select: typeof listSelect;
}>;

export type VehicleListResult = {
  vehicles: ListVehicle[];
  featured: ListVehicle[];
  total: number;
  page: number;
  totalPages: number;
};

/** How many promoted listings are pinned to the top of each page. */
export const FEATURED_PER_PAGE = 2;

/**
 * Translate validated filters into a Prisma `where`.
 *
 * Exported so the facet counts in `facets.ts` can count against exactly the
 * same predicate the listing uses.
 */
export function buildVehicleWhere(
  filters: Partial<VehicleFilterInput>
): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {};
  const and: Prisma.VehicleWhereInput[] = [];

  // Sold vehicles are hidden unless explicitly asked for. Mixing them into
  // results with no way to exclude them wastes the buyer's attention.
  if (!filters.includeSold) where.status = "ON_SALE";

  if (filters.brand?.length) where.brand = { in: filters.brand };
  if (filters.bodyType?.length) where.bodyType = { in: filters.bodyType };
  if (filters.fuelType?.length) where.fuelType = { in: filters.fuelType };
  if (filters.condition?.length) where.condition = { in: filters.condition };
  if (filters.specOrigin?.length) where.specOrigin = { in: filters.specOrigin };
  if (filters.transmission) where.transmission = filters.transmission;
  if (filters.agency) where.waredWakaleh = true;
  if (filters.dealer) where.dealership = { slug: filters.dealer };

  if (filters.model?.length) {
    and.push({
      OR: filters.model.map((m) => ({
        model: { contains: m, mode: "insensitive" as const },
      })),
    });
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {
      ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.minYear != null || filters.maxYear != null) {
    where.productionYear = {
      ...(filters.minYear != null ? { gte: filters.minYear } : {}),
      ...(filters.maxYear != null ? { lte: filters.maxYear } : {}),
    };
  }

  if (filters.maxKm != null) where.mileageKm = { lte: filters.maxKm };

  if (filters.ids?.length) and.push({ id: { in: filters.ids } });

  if (and.length) where.AND = and;
  return where;
}

function orderFor(
  sortBy: VehicleFilterInput["sortBy"]
): Prisma.VehicleOrderByWithRelationInput[] {
  switch (sortBy) {
    case "price_asc":
      return [{ price: "asc" }, { id: "asc" }];
    case "price_desc":
      return [{ price: "desc" }, { id: "asc" }];
    case "year_desc":
      return [{ productionYear: "desc" }, { id: "asc" }];
    case "mileage_asc":
      return [{ mileageKm: "asc" }, { id: "asc" }];
    case "oldest":
      return [{ publicationDate: "asc" }, { id: "asc" }];
    default:
      return [{ publicationDate: "desc" }, { id: "asc" }];
  }
}

/**
 * One page of listings.
 *
 * Promoted listings are pinned as a small number of "Featured" slots per page
 * rather than sorted ahead of everything. Sorting all promoted rows first made
 * the first dozens of pages entirely sponsored, which silently broke every
 * other sort option and buried the listings dealers were not paying for.
 */
export async function getVehicles(
  rawFilters: Partial<VehicleFilterInput> = {}
): Promise<VehicleListResult> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  const parsed = vehicleFilterSchema.safeParse(rawFilters);
  const filters = parsed.success ? parsed.data : vehicleFilterSchema.parse({});

  const where = buildVehicleWhere(filters);
  const orderBy = orderFor(filters.sortBy);
  const limit = filters.limit;
  const page = filters.page;

  const featuredWhere: Prisma.VehicleWhereInput = {
    ...where,
    isPromoted: true,
  };

  const [featuredPool, total] = await Promise.all([
    db.vehicle.findMany({
      where: featuredWhere,
      orderBy,
      skip: (page - 1) * FEATURED_PER_PAGE,
      take: FEATURED_PER_PAGE,
      select: listSelect,
    }),
    db.vehicle.count({ where }),
  ]);

  const featuredIds = featuredPool.map((v) => v.id);

  const vehicles = await db.vehicle.findMany({
    where: featuredIds.length
      ? { ...where, NOT: { id: { in: featuredIds } } }
      : where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit - featuredPool.length,
    select: listSelect,
  });

  return {
    vehicles,
    featured: featuredPool,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** Result count only. Used for the filter preview and facet labels. */
export async function countVehicles(
  rawFilters: Partial<VehicleFilterInput> = {}
): Promise<number> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  const parsed = vehicleFilterSchema.safeParse(rawFilters);
  const filters = parsed.success ? parsed.data : vehicleFilterSchema.parse({});
  return db.vehicle.count({ where: buildVehicleWhere(filters) });
}

export async function getVehicleById(id: string) {
  "use cache";
  cacheTag(CACHE_TAGS.vehicle(id));
  cacheLife("max");

  return db.vehicle.findUnique({
    where: { id },
    include: {
      dealership: true,
      user: { select: { name: true, phone: true, image: true } },
    },
  });
}

/** Newest listings, for the landing page strip. */
export async function getRecentVehicles(take = 8): Promise<ListVehicle[]> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  return db.vehicle.findMany({
    where: { status: "ON_SALE" },
    orderBy: [{ publicationDate: "desc" }, { id: "asc" }],
    take,
    select: listSelect,
  });
}

/** Promoted listings, for the landing page strip. */
export async function getFeaturedVehicles(take = 8): Promise<ListVehicle[]> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  return db.vehicle.findMany({
    where: { status: "ON_SALE", isPromoted: true },
    orderBy: [{ publicationDate: "desc" }, { id: "asc" }],
    take,
    select: listSelect,
  });
}

/**
 * Cars a buyer looking at this one would also consider: same body type within
 * 20% of the price, then anything from the same brand to fill the row.
 */
export async function getSimilarVehicles(
  vehicleId: string,
  take = 4
): Promise<ListVehicle[]> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  const base = await db.vehicle.findUnique({
    where: { id: vehicleId },
    select: { id: true, brand: true, bodyType: true, price: true },
  });
  if (!base) return [];

  const nearPrice = await db.vehicle.findMany({
    where: {
      status: "ON_SALE",
      id: { not: base.id },
      bodyType: base.bodyType,
      price: {
        gte: Math.round(base.price * 0.8),
        lte: Math.round(base.price * 1.2),
      },
    },
    orderBy: [{ isPromoted: "desc" }, { publicationDate: "desc" }],
    take,
    select: listSelect,
  });

  if (nearPrice.length >= take) return nearPrice;

  const sameBrand = await db.vehicle.findMany({
    where: {
      status: "ON_SALE",
      brand: base.brand,
      id: { notIn: [base.id, ...nearPrice.map((v) => v.id)] },
    },
    orderBy: [{ isPromoted: "desc" }, { publicationDate: "desc" }],
    take: take - nearPrice.length,
    select: listSelect,
  });

  return [...nearPrice, ...sameBrand];
}

/**
 * Median asking price for comparable cars, used for the "below average"
 * context line on a detail page.
 *
 * Returns null when there are too few comparables to say anything honest —
 * a price comparison drawn from two other listings is noise presented as
 * insight.
 */
export async function getPriceContext(
  vehicleId: string
): Promise<{ median: number; sampleSize: number } | null> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  const base = await db.vehicle.findUnique({
    where: { id: vehicleId },
    select: { id: true, brand: true, model: true, productionYear: true },
  });
  if (!base) return null;

  const comparables = await db.vehicle.findMany({
    where: {
      status: "ON_SALE",
      id: { not: base.id },
      brand: base.brand,
      model: base.model,
      productionYear: {
        gte: base.productionYear - 1,
        lte: base.productionYear + 1,
      },
    },
    select: { price: true },
  });

  const MIN_SAMPLE = 5;
  if (comparables.length < MIN_SAMPLE) return null;

  const prices = comparables.map((c) => c.price).sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const median =
    prices.length % 2 === 0
      ? Math.round((prices[mid - 1] + prices[mid]) / 2)
      : prices[mid];

  return { median, sampleSize: prices.length };
}

/**
 * When a filter set returns nothing, work out which single filter to drop to
 * get results back, so the empty state can offer a way forward instead of
 * telling the buyer to "try adjusting your filters".
 */
export type Relaxation = {
  /** URL parameter to remove. */
  key: string;
  /** Human label for the filter being dropped. */
  label: string;
  /** How many cars appear if it is removed. */
  count: number;
};

const RELAXABLE: { key: keyof VehicleFilterInput; label: string }[] = [
  { key: "q", label: "the search term" },
  { key: "brand", label: "the brand filter" },
  { key: "model", label: "the model filter" },
  { key: "maxPrice", label: "the maximum price" },
  { key: "minPrice", label: "the minimum price" },
  { key: "maxKm", label: "the mileage limit" },
  { key: "minYear", label: "the earliest year" },
  { key: "maxYear", label: "the latest year" },
  { key: "bodyType", label: "the body type" },
  { key: "fuelType", label: "the fuel type" },
  { key: "condition", label: "the condition" },
  { key: "specOrigin", label: "the spec origin" },
  { key: "transmission", label: "the transmission" },
  { key: "agency", label: "the agency-import filter" },
];

export async function getRelaxations(
  rawFilters: Partial<VehicleFilterInput>
): Promise<Relaxation[]> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  const parsed = vehicleFilterSchema.safeParse(rawFilters);
  const filters = parsed.success ? parsed.data : vehicleFilterSchema.parse({});

  const applied = RELAXABLE.filter((r) => {
    const value = filters[r.key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  const results = await Promise.all(
    applied.map(async (r) => {
      const without = { ...filters, [r.key]: undefined };
      const count = await db.vehicle.count({
        where: buildVehicleWhere(without),
      });
      return { key: r.key as string, label: r.label, count };
    })
  );

  return results
    .filter((r) => r.count > 0)
    .sort((a, b) => a.count - b.count)
    .slice(0, 3);
}
