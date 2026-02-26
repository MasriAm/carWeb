import { Skeleton } from "@/components/ui/skeleton";

export default function VehiclesLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-2 bg-zinc-800" />
      <Skeleton className="h-5 w-48 mb-8 bg-zinc-800" />
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-zinc-800 last:border-0">
            <Skeleton className="h-10 w-14 rounded bg-zinc-800" />
            <Skeleton className="h-5 w-36 bg-zinc-800" />
            <Skeleton className="h-5 w-24 ml-auto bg-zinc-800" />
            <Skeleton className="h-5 w-16 bg-zinc-800" />
            <Skeleton className="h-6 w-16 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
