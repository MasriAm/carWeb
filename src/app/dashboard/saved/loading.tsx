import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-2 bg-surface-2" />
      <Skeleton className="h-5 w-56 mb-8 bg-surface-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl border border-line overflow-hidden"
          >
            <Skeleton className="aspect-[16/10] w-full bg-surface-2" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-40 bg-surface-2" />
              <Skeleton className="h-4 w-full bg-surface-2" />
              <Skeleton className="h-4 w-3/4 bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
