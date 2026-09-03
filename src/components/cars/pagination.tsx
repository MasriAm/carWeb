import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pagination as links, not buttons.
 *
 * The previous version pushed routes from onClick handlers, so page two was
 * invisible to a crawler, could not be opened in a new tab, and could not be
 * prefetched. These are real anchors carrying the full filter state.
 */
export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value == null) continue;
      params.set(key, Array.isArray(value) ? value[0] : value);
    }
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/cars?${query}` : "/cars";
  };

  const pages: (number | "gap")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("gap");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("gap");
    pages.push(totalPages);
  }

  const arrow =
    "inline-flex h-10 w-10 items-center justify-center rounded-control border border-line-control text-ink-2 transition-colors hover:bg-surface-2";

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {currentPage > 1 ? (
            <Link
              href={hrefFor(currentPage - 1)}
              rel="prev"
              aria-label="Previous page"
              className={arrow}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span aria-hidden="true" className={cn(arrow, "cursor-default opacity-40")}>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
        </li>

        {pages.map((page, i) =>
          page === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-ink-3">
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={hrefFor(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 min-w-10 items-center justify-center rounded-control border px-3 text-body-sm font-medium tabular-nums transition-colors",
                  page === currentPage
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-line-control text-ink-2 hover:bg-surface-2"
                )}
              >
                {page}
              </Link>
            </li>
          )
        )}

        <li>
          {currentPage < totalPages ? (
            <Link
              href={hrefFor(currentPage + 1)}
              rel="next"
              aria-label="Next page"
              className={arrow}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span aria-hidden="true" className={cn(arrow, "cursor-default opacity-40")}>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
