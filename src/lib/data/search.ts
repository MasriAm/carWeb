import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Keyword search.
 *
 * This is the single documented exception to the Prisma-only rule. The query
 * needs `websearch_to_tsquery`, `ts_rank` and a trigram similarity fallback,
 * none of which Prisma's query builder can express. It is a parameterised
 * `$queryRaw` — the search term is bound, never interpolated — and it returns
 * only ids, which `getVehicles` then loads through Prisma as usual.
 *
 * Two passes, because they catch different mistakes:
 *   1. Full-text against the generated `searchVector`, where brand and model
 *      are weighted above the description. Handles "prado 2019".
 *   2. Trigram similarity on brand + model. Handles "mercedez", "landcru"
 *      and other misspellings that produce no lexeme match at all.
 */

const MAX_RESULTS = 500;

/** Common ways people type brands that do not match the stored spelling. */
const BRAND_ALIASES: Record<string, string> = {
  mercedes: "Mercedes-Benz",
  merc: "Mercedes-Benz",
  mercedez: "Mercedes-Benz",
  benz: "Mercedes-Benz",
  "land rover": "Range Rover",
  landrover: "Range Rover",
  rangerover: "Range Rover",
  vw: "Volkswagen",
  chevy: "Chevrolet",
  beemer: "BMW",
  bimmer: "BMW",
  toyata: "Toyota",
  hyundai: "Hyundai",
  hundai: "Hyundai",
};

/** Expands an alias so "merc c200" also searches "Mercedes-Benz c200". */
export function expandQuery(raw: string): string {
  const lower = raw.toLowerCase().trim();
  for (const [alias, canonical] of Object.entries(BRAND_ALIASES)) {
    if (lower === alias || lower.startsWith(`${alias} `)) {
      return `${canonical}${raw.slice(alias.length)}`;
    }
  }
  return raw;
}

export async function searchVehicleIds(rawQuery: string): Promise<string[]> {
  "use cache";
  cacheTag(CACHE_TAGS.vehicles);
  cacheLife("max");

  const query = expandQuery(rawQuery).trim();
  if (query.length < 2) return [];

  const rows = await db.$queryRaw<{ id: string }[]>`
    WITH q AS (
      SELECT websearch_to_tsquery('simple', ${query}) AS tsq,
             ${query}::text AS raw
    )
    SELECT v.id
    FROM "Vehicle" v, q
    WHERE v."searchVector" @@ q.tsq
       OR (v."brand" || ' ' || v."model") % q.raw
    ORDER BY
      ts_rank(v."searchVector", q.tsq) DESC,
      similarity(v."brand" || ' ' || v."model", q.raw) DESC,
      v."publicationDate" DESC
    LIMIT ${MAX_RESULTS}
  `;

  return rows.map((r) => r.id);
}
