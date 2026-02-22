import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-5 w-56 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
          >
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
