import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-56 mb-2 bg-surface-2" />
      <Skeleton className="h-5 w-72 mb-8 bg-surface-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl border border-line p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-surface-2" />
                <Skeleton className="h-9 w-16 bg-surface-2" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
