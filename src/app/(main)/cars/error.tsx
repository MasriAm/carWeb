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
    <section className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft mb-6">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">
          Something went wrong
        </h1>
        <p className="text-ink-3 mb-6">
          We couldn&apos;t load the vehicle listings. This might be a temporary issue.
        </p>
        <Button onClick={reset} className="bg-brand text-brand-ink hover:bg-brand-hover">Try Again</Button>
      </div>
    </section>
  );
}
