"use client";

import { clearFilters } from "@/lib/filter-params";
import { useFilterNav } from "./use-filter-nav";

/**
 * Removes one filter, or all of them, from the URL. Used by the empty state's
 * recovery suggestions.
 */
export default function ClearFiltersLink({
  keys,
  children,
  className,
}: {
  keys?: string[];
  children: React.ReactNode;
  className?: string;
}) {
  const { commit } = useFilterNav();

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        commit((params) => {
          if (keys?.length) {
            for (const key of keys) params.delete(key);
          } else {
            clearFilters(params);
          }
        })
      }
    >
      {children}
    </button>
  );
}
