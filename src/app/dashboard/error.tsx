"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        Dashboard Error
      </h1>
      <p className="text-neutral-500 mb-6 max-w-md">
        Something went wrong loading this page. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
