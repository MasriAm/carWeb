import { Skeleton } from "@/components/ui/skeleton";

export default function CarsLoading() {
  return (
    <section className="min-h-screen bg-canvas">
      <div className="h-12 bg-canvas border-b border-line" />
      <div className="max-w-page mx-auto px-4 py-8">
        <Skeleton className="h-9 w-64 mb-2 bg-surface-2" />
        <Skeleton className="h-5 w-32 mb-8 bg-surface-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-xl border border-line overflow-hidden"
            >
              <Skeleton className="aspect-[16/10] w-full bg-surface-2" />
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-40 bg-surface-2" />
                  <Skeleton className="h-6 w-24 bg-surface-2" />
                </div>
                <Skeleton className="h-4 w-full bg-surface-2" />
                <Skeleton className="h-4 w-3/4 bg-surface-2" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full bg-surface-2" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
