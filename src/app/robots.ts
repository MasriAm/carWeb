import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * There was no robots.txt, so nothing told a crawler where the sitemap was or
 * kept it out of the private areas.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/login",
          "/register",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
