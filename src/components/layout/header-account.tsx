import { getSessionUser } from "@/lib/data/session";
import UserMenu from "./user-menu";
import MobileAccount from "./mobile-account";

/**
 * The only part of the header that depends on the request.
 *
 * Rendered inside a Suspense boundary so reading the session cookie does not
 * hold up the rest of the page: the logo, navigation and page content all
 * prerender, and this streams in.
 */
export async function HeaderAccount() {
  const user = await getSessionUser();
  return <UserMenu user={user} />;
}

export async function HeaderAccountMobile() {
  const user = await getSessionUser();
  return <MobileAccount user={user} />;
}

/** Matches the resolved control's footprint so nothing shifts on arrival. */
export function AccountFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-9 w-[8.5rem] animate-pulse rounded-full bg-surface-2"
    />
  );
}

export function AccountFallbackMobile() {
  return (
    <div
      aria-hidden="true"
      className="h-24 animate-pulse rounded-control bg-surface-2"
    />
  );
}
