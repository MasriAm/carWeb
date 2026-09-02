import Link from "next/link";
import { Bookmark } from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { getSavedSearches } from "@/lib/data/session";
import { Button } from "@/components/ui/button";
import SavedSearchRow from "@/components/dashboard/saved-search-row";

export const metadata = { title: "Saved searches" };

/** Describes a stored query string in words, so the list is scannable. */
export function describeQuery(query: string): string {
  const params = new URLSearchParams(query);
  const parts: string[] = [];

  const q = params.get("q");
  if (q) parts.push(`“${q}”`);
  for (const key of ["brand", "model", "bodyType", "fuelType", "condition"]) {
    const value = params.get(key);
    if (value) parts.push(value.split(",").join(", "));
  }
  const min = params.get("minPrice");
  const max = params.get("maxPrice");
  if (min || max) {
    parts.push(`${min ?? "any"}–${max ?? "any"} JOD`);
  }
  if (params.get("maxKm")) parts.push(`under ${params.get("maxKm")} km`);
  if (params.get("agency") === "1") parts.push("agency import");

  return parts.length ? parts.join(" · ") : "All cars";
}

export default async function SavedSearchesPage() {
  await requireAuth();
  const searches = await getSavedSearches();

  return (
    <div>
      <h1 className="text-h2 font-bold text-ink">Saved searches</h1>
      <p className="mt-1 text-body-sm text-ink-3">
        {searches.length === 0
          ? "Filter sets you keep will appear here."
          : `${searches.length} saved.`}
      </p>

      <div className="mt-8">
        {searches.length === 0 ? (
          <div className="rounded-card border border-line bg-surface px-6 py-16 text-center">
            <Bookmark
              className="mx-auto mb-4 h-10 w-10 text-ink-3"
              aria-hidden="true"
            />
            <h2 className="text-title font-semibold text-ink">
              No saved searches yet
            </h2>
            <p className="mx-auto mt-2 max-w-prose text-body-sm text-ink-3">
              Set up the filters you care about, then use “Save search” on the
              browse page to keep them.
            </p>
            <Button asChild className="mt-6">
              <Link href="/cars">Browse cars</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
            {searches.map((search) => (
              <li key={search.id}>
                <SavedSearchRow
                  id={search.id}
                  name={search.name}
                  query={search.query}
                  description={describeQuery(search.query)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
