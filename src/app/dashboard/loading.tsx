import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-56 mb-2 bg-zinc-800" />
      <Skeleton className="h-5 w-72 mb-8 bg-zinc-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-zinc-800" />
                <Skeleton className="h-9 w-16 bg-zinc-800" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
