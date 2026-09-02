"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Crown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/lib/session-provider";
import { cn } from "@/lib/utils";
import { isSectionActive } from "./header-nav";

type NavLink = { readonly href: string; readonly label: string };

export default function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useSession();

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[19rem] bg-surface p-0">
        <SheetHeader className="border-b border-line px-5 py-4">
          <SheetTitle className="flex items-center gap-2.5">
            <Crown className="h-5 w-5 text-brand" aria-hidden="true" />
            <span className="font-display text-lead text-ink">Royal Cars</span>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
          {links.map((link) => {
            const active = isSectionActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-control px-3 text-body font-medium transition-colors",
                  active
                    ? "bg-brand-soft text-ink"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-line p-3">
          {user ? (
            <div className="flex flex-col gap-1">
              <Link
                href="/dashboard"
                onClick={close}
                className="flex min-h-11 items-center rounded-control px-3 text-body font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={close}
                className="flex min-h-11 items-center rounded-control px-3 text-body font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
              >
                Profile settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  close();
                  signOut({ callbackUrl: "/" });
                }}
                className="flex min-h-11 items-center rounded-control px-3 text-start text-body font-medium text-danger hover:bg-danger-soft"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="h-11 w-full">
                <Link href="/login" onClick={close}>
                  Sign in
                </Link>
              </Button>
              <Button asChild className="h-11 w-full">
                <Link href="/register" onClick={close}>
                  Create account
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
