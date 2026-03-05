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
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-zinc-950">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg shadow-black/20 p-8 text-center">
        {isRateLimit && (
          <>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Timer className="h-7 w-7 text-amber-500" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100 mb-2">Slow down</h1>
            <p className="text-zinc-400 text-sm mb-6">
              You&apos;re making too many requests. Please wait a moment before trying again.
            </p>
          </>
        )}
        {isUnauthorized && !isRateLimit && (
          <>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Lock className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100 mb-2">Access denied</h1>
            <p className="text-zinc-400 text-sm mb-6">
              You don&apos;t have permission to perform this action.
            </p>
          </>
        )}
        {!isRateLimit && !isUnauthorized && (
          <>
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-zinc-400" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100 mb-2">Something went wrong</h1>
            <p className="text-zinc-400 text-sm mb-6">
              An unexpected error occurred. Please try again.
            </p>
          </>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-amber-500 text-zinc-950 hover:bg-amber-400"
          >
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Return to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
