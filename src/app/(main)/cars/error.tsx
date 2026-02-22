"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function CarsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-neutral-500 mb-6">
          We couldn&apos;t load the vehicle listings. This might be a temporary issue.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </section>
  );
}
