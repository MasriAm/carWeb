import Link from "next/link";
import { Crown } from "lucide-react";
import HeaderNav from "./header-nav";
import UserMenu from "./user-menu";
import MobileMenu from "./mobile-menu";

export const NAV_LINKS = [
  { href: "/cars", label: "Browse cars" },
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "About" },
] as const;

/**
 * Sticky rather than fixed. A fixed header sits outside the layout flow, so
 * every page had to reserve space for it by hand — and the detail page did
 * not, which put its "Back to browse" link underneath the header where it
 * could not be clicked. Sticky keeps the bar pinned without any page needing
 * to know how tall it is.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="mx-auto flex h-header max-w-page items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-control"
        >
          <Crown className="h-6 w-6 text-brand" aria-hidden="true" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lead text-ink">Royal Cars</span>
            <span className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-3">
              Jordan
            </span>
          </span>
        </Link>

        <HeaderNav links={NAV_LINKS} />

        <div className="ms-auto flex items-center gap-2">
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
