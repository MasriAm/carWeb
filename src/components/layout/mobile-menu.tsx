"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { isSectionActive } from "./header-nav";

type NavLink = { readonly href: string; readonly label: string };

/**
 * The sheet shell is static. `account` is a server-rendered slot passed as
 * children, so the session streams into the drawer without making the menu
 * button itself wait on a cookie read.
 */
export default function MobileMenu({
  links,
  account,
}: {
  links: readonly NavLink[];
  account: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[19rem] flex-col bg-surface p-0">
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
                onClick={() => setOpen(false)}
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

        <div className="mt-auto border-t border-line p-3" onClick={() => setOpen(false)}>
          {account}
        </div>
      </SheetContent>
    </Sheet>
  );
}
