"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, Lock, AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const msg = error?.message ?? "";
  const isRateLimit = /rate limit/i.test(msg);
  const isUnauthorized = /unauthorized/i.test(msg);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-canvas">
      <div className="w-full max-w-md rounded-xl bg-surface border border-line shadow-lg shadow-card p-8 text-center">
        {isRateLimit && (
          <>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center">
              <Timer className="h-7 w-7 text-brand-strong" />
            </div>
            <h1 className="text-xl font-bold text-ink mb-2">Slow down</h1>
            <p className="text-ink-3 text-sm mb-6">
              You&apos;re making too many requests. Please wait a moment before trying again.
            </p>
          </>
        )}
        {isUnauthorized && !isRateLimit && (
          <>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-danger-soft border border-danger/25 flex items-center justify-center">
              <Lock className="h-7 w-7 text-danger" />
            </div>
            <h1 className="text-xl font-bold text-ink mb-2">Access denied</h1>
            <p className="text-ink-3 text-sm mb-6">
              You don&apos;t have permission to perform this action.
            </p>
          </>
        )}
        {!isRateLimit && !isUnauthorized && (
          <>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-surface-2 border border-line-control flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-ink-3" />
            </div>
            <h1 className="text-xl font-bold text-ink mb-2">Something went wrong</h1>
            <p className="text-ink-3 text-sm mb-6">
              An unexpected error occurred. Please try again.
            </p>
          </>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-brand text-brand-ink hover:bg-brand-hover"
          >
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto border-line-control text-ink-2 hover:bg-surface-2 hover:text-ink">
              Return to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
