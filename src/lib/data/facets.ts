import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Facet aggregates: the brand list, price bounds, body-type counts and the
 * headline inventory numbers.
 *
 * These change when a dealer lists or sells a car, which is rare compared to
 * how often they are read, so they are cached until a mutation invalidates
 * them rather than recomputed per render.
 *
 * The brand list in particular used to be `findMany({ distinct: ["brand"] })`.
 * Prisma applies `distinct` in memory, so the SQL it emitted had no DISTINCT
 * and no LIMIT: every render of /cars pulled the entire Vehicle table across
 * the wire to produce about twenty strings. `groupBy` does it in Postgres.
 */

export type BrandFacet = { brand: string; count: number };

export async function getBrandFacets(limit?: number): Promise<BrandFacet[]> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  const rows = await db.vehicle.groupBy({
    by: ["brand"],
    where: { status: "ON_SALE" },
    _count: { _all: true },
    orderBy: { _count: { brand: "desc" } },
    ...(limit ? { take: limit } : {}),
  });

  return rows.map((r) => ({ brand: r.brand, count: r._count._all }));
}

/** Brands in alphabetical order, for the "all brands" list. */
export async function getBrandsAlphabetical(): Promise<BrandFacet[]> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  const rows = await db.vehicle.groupBy({
    by: ["brand"],
    where: { status: "ON_SALE" },
    _count: { _all: true },
    orderBy: { brand: "asc" },
  });

  return rows.map((r) => ({ brand: r.brand, count: r._count._all }));
}

export async function getModelsForBrands(
  brands: string[]
): Promise<{ model: string; count: number }[]> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  if (!brands.length) return [];

  const rows = await db.vehicle.groupBy({
    by: ["model"],
    where: { status: "ON_SALE", brand: { in: brands } },
    _count: { _all: true },
    orderBy: { _count: { model: "desc" } },
    take: 60,
  });

  return rows.map((r) => ({ model: r.model, count: r._count._all }));
}

export type BodyTypeFacet = { bodyType: string; count: number };

export async function getBodyTypeFacets(): Promise<BodyTypeFacet[]> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  const rows = await db.vehicle.groupBy({
    by: ["bodyType"],
    where: { status: "ON_SALE" },
    _count: { _all: true },
    orderBy: { _count: { bodyType: "desc" } },
  });

  return rows.map((r) => ({ bodyType: r.bodyType, count: r._count._all }));
}

/**
 * Real price and year bounds, so the sliders describe the actual market
 * instead of a hardcoded 0–500,000 range in which the band most cars sit in
 * occupies the first few percent of the track.
 */
export type MarketBounds = {
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  maxKm: number;
};

export async function getMarketBounds(): Promise<MarketBounds> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  const agg = await db.vehicle.aggregate({
    where: { status: "ON_SALE" },
    _min: { price: true, productionYear: true },
    _max: { price: true, productionYear: true, mileageKm: true },
  });

  const currentYear = new Date().getFullYear();

  return {
    minPrice: agg._min.price ?? 0,
    maxPrice: agg._max.price ?? 200_000,
    minYear: agg._min.productionYear ?? 2000,
    maxYear: agg._max.productionYear ?? currentYear,
    maxKm: agg._max.mileageKm ?? 300_000,
  };
}

/**
 * Headline inventory numbers for the landing page.
 *
 * Every figure here is a query. The page previously showed four hardcoded
 * constants ("1,200+ Vehicles Listed", "12K+ Happy Buyers"); a fabricated
 * trust signal on a marketplace is worse than none.
 */
export type MarketStats = {
  onSale: number;
  dealerships: number;
  brands: number;
  agencyImports: number;
};

export async function getMarketStats(): Promise<MarketStats> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  const [onSale, dealerships, brandRows, agencyImports] = await Promise.all([
    db.vehicle.count({ where: { status: "ON_SALE" } }),
    db.dealership.count(),
    db.vehicle.groupBy({
      by: ["brand"],
      where: { status: "ON_SALE" },
      _count: { _all: true },
    }),
    db.vehicle.count({ where: { status: "ON_SALE", waredWakaleh: true } }),
  ]);

  return {
    onSale,
    dealerships,
    brands: brandRows.length,
    agencyImports,
  };
}

/**
 * Budget bands for the landing page, with a live count each. Bands are chosen
 * around where the Jordanian market actually sits rather than split evenly
 * across the full price range.
 */
export const BUDGET_BANDS: {
  label: string;
  min?: number;
  max?: number;
}[] = [
  { label: "Under 10,000", max: 10_000 },
  { label: "10,000 – 20,000", min: 10_000, max: 20_000 },
  { label: "20,000 – 35,000", min: 20_000, max: 35_000 },
  { label: "35,000 – 60,000", min: 35_000, max: 60_000 },
  { label: "60,000 and above", min: 60_000 },
];

export type BudgetFacet = {
  label: string;
  min?: number;
  max?: number;
  count: number;
};

export async function getBudgetFacets(): Promise<BudgetFacet[]> {
  "use cache";
  cacheTag(CACHE_TAGS.facets);
  cacheLife("max");

  const counts = await Promise.all(
    BUDGET_BANDS.map((band) =>
      db.vehicle.count({
        where: {
          status: "ON_SALE",
          price: {
            ...(band.min != null ? { gte: band.min } : {}),
            ...(band.max != null ? { lt: band.max } : {}),
          },
        },
      })
    )
  );

  return BUDGET_BANDS.map((band, i) => ({
    label: band.label,
    min: band.min,
    max: band.max,
    count: counts[i],
  }));
}
