import { Suspense } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import HeaderNav, { HeaderNavStatic } from "./header-nav";
import MobileMenu from "./mobile-menu";
import {
  AccountFallback,
  AccountFallbackMobile,
  HeaderAccount,
  HeaderAccountMobile,
} from "./header-account";

/** Placeholder with the trigger's exact footprint, so nothing shifts. */
function MenuButtonFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-9 w-9 rounded-control bg-surface-2 md:hidden"
    />
  );
}

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
 *
 * Everything except the account control prerenders; the session-dependent
 * part streams in behind its own Suspense boundary.
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

        <Suspense fallback={<HeaderNavStatic links={NAV_LINKS} />}>
          <HeaderNav links={NAV_LINKS} />
        </Suspense>

        <div className="ms-auto flex items-center gap-2">
          <div className="hidden md:block">
            <Suspense fallback={<AccountFallback />}>
              <HeaderAccount />
            </Suspense>
          </div>
          <Suspense fallback={<MenuButtonFallback />}>
            <MobileMenu
              links={NAV_LINKS}
              account={
                <Suspense fallback={<AccountFallbackMobile />}>
                  <HeaderAccountMobile />
                </Suspense>
              }
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
