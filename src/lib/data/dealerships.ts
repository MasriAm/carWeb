import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type DealershipSummary = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  address: string | null;
  listingCount: number;
};

/** Dealerships that actually have cars for sale, most inventory first. */
export async function getActiveDealerships(
  take?: number
): Promise<DealershipSummary[]> {
  "use cache";
  cacheTag(CACHE_TAGS.dealerships);
  cacheLife("max");

  const rows = await db.dealership.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      address: true,
      _count: { select: { vehicles: { where: { status: "ON_SALE" } } } },
    },
  });

  return rows
    .map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      logoUrl: d.logoUrl,
      address: d.address,
      listingCount: d._count.vehicles,
    }))
    .filter((d) => d.listingCount > 0)
    .sort((a, b) => b.listingCount - a.listingCount)
    .slice(0, take ?? undefined);
}

export async function getDealershipBySlug(slug: string) {
  "use cache";
  cacheTag(CACHE_TAGS.dealerships);
  cacheLife("max");

  return db.dealership.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      address: true,
      phone: true,
      whatsappNumber: true,
      website: true,
      createdAt: true,
      _count: { select: { vehicles: { where: { status: "ON_SALE" } } } },
    },
  });
}

/** Slugs for the sitemap and static params. */
export async function getDealershipSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CACHE_TAGS.dealerships);
  cacheLife("max");

  const rows = await db.dealership.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
