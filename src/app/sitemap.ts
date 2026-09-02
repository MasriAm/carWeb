import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getBrandsAlphabetical } from "@/lib/data/facets";
import { getDealershipSlugs } from "@/lib/data/dealerships";
import { siteConfig } from "@/lib/site-config";

/**
 * Sitemap.
 *
 * The site had none, so every listing depended on being crawled through the
 * paginated grid. Includes the static pages, every car currently for sale,
 * every dealer, and one landing URL per brand — those brand URLs are the
 * queries people actually search for ("BMW for sale Jordan").
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [vehicles, dealerSlugs, brands] = await Promise.all([
    db.vehicle.findMany({
      where: { status: "ON_SALE" },
      select: { id: true, updatedAt: true },
      orderBy: { publicationDate: "desc" },
      take: 40_000,
    }),
    getDealershipSlugs(),
    getBrandsAlphabetical(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/cars`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/dealers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...brands.map((b) => ({
      url: `${base}/cars?brand=${encodeURIComponent(b.brand)}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...dealerSlugs.map((slug) => ({
      url: `${base}/dealers/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...vehicles.map((v) => ({
      url: `${base}/cars/${v.id}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
