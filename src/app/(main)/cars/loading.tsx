import { Skeleton } from "@/components/ui/skeleton";

export default function CarsLoading() {
  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-32 mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
