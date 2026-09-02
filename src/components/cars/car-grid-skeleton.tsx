/**
 * Loading state for the results grid.
 *
 * Deliberately the same shape as a real card — image block, price line, title,
 * meta line, action row — so the layout does not jump when results arrive.
 */
export default function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading vehicles"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card border border-line bg-surface"
        >
          <div className="aspect-[4/3] animate-pulse bg-surface-2" />
          <div className="space-y-3 p-4">
            <div className="h-6 w-28 animate-pulse rounded bg-surface-2" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-11 w-full animate-pulse rounded-control bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
