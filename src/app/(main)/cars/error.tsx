"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function CarsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-zinc-400 mb-6">
          We couldn&apos;t load the vehicle listings. This might be a temporary issue.
        </p>
        <Button onClick={reset} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">Try Again</Button>
      </div>
    </section>
  );
}
