import { Skeleton } from "@/components/ui/skeleton";

export default function VehiclesLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-5 w-48 mb-8" />
      <div className="bg-white rounded-xl border border-neutral-200 p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-neutral-100 last:border-0">
            <Skeleton className="h-10 w-14 rounded" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24 ml-auto" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
