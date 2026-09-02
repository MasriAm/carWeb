"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "./user-menu";

/** Account section of the mobile sheet. Streams in with the session. */
export default function MobileAccount({ user }: { user: SessionUser }) {
  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild className="h-11 w-full">
          <Link href="/register">Create account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Link
        href="/dashboard"
        className="flex min-h-11 items-center rounded-control px-3 text-body font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/profile"
        className="flex min-h-11 items-center rounded-control px-3 text-body font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
      >
        Profile settings
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex min-h-11 items-center rounded-control px-3 text-start text-body font-medium text-danger hover:bg-danger-soft"
      >
        Sign out
      </button>
    </div>
  );
}
