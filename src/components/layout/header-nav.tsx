"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavLink = { readonly href: string; readonly label: string };

/**
 * A section stays marked active for its whole subtree, so "Browse cars" is
 * still highlighted while the visitor is reading `/cars/[id]`.
 */
export function isSectionActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkClass = (active: boolean) =>
  cn(
    "inline-flex min-h-9 items-center rounded-control px-3 text-body-sm font-medium transition-colors",
    active
      ? "bg-surface-2 text-ink"
      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
  );

/**
 * Rendered without active state. Used as the Suspense fallback on dynamic
 * routes, where the pathname is not known at prerender time — the links are
 * present and clickable immediately, and the highlight arrives with the
 * stream rather than the whole bar waiting on it.
 */
export function HeaderNavStatic({ links }: { links: readonly NavLink[] }) {
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass(false)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function HeaderNav({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {links.map((link) => {
          const active = isSectionActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
