import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-2 bg-zinc-800" />
      <Skeleton className="h-5 w-56 mb-8 bg-zinc-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
          >
            <Skeleton className="aspect-[16/10] w-full bg-zinc-800" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-40 bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
              <Skeleton className="h-4 w-3/4 bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
